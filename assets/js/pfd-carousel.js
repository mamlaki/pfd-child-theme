(function () {
  if (typeof window === 'undefined') return;

  // ---------- utils ----------
  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
  function parsePx(v) { if (!v || v === 'normal') return 0; const n = parseFloat(v); return isNaN(n) ? 0 : n; }

  function getMetrics(track, slides) {
    const cs = getComputedStyle(track);
    const gap = parsePx(cs.columnGap || cs.gap);
    const first = slides[0];
    const slideW = first ? first.getBoundingClientRect().width : track.clientWidth;

    // distance between slide starts
    let span = 0;
    if (slides.length >= 2) span = slides[1].offsetLeft - slides[0].offsetLeft;
    if (span <= 0) span = slideW + gap;

    // how many are fully visible-ish per viewport width
    const visible = Math.max(1, Math.round(track.clientWidth / (span || 1)));

    const totalSlides = slides.length;
    const maxStart = Math.max(0, totalSlides - visible);
    const totalPages = maxStart + 1; // one page per valid start index

    return { gap, slideW, itemSpan: span, visible, totalSlides, maxStart, totalPages };
  }

  function buildDots(carousel, totalPages) {
    let dots = carousel.querySelector('.pfd-carousel__dots');
    if (!dots) {
      dots = document.createElement('div');
      dots.className = 'pfd-carousel__dots';
      carousel.appendChild(dots);
    }
    dots.innerHTML = '';

    dots.setAttribute('role', 'tablist');
    dots.setAttribute('aria-label', 'Carousel pagination');

    for (let i = 0; i < totalPages; i++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pfd-carousel__dot';
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      btn.setAttribute('aria-label', `Go to page ${i + 1}`);
      if (i === 0) btn.setAttribute('aria-current', 'true');
      btn.dataset.index = String(i);
      dots.appendChild(btn);
    }
    return dots;
  }

  const getStartIndexForPage = (pageIdx, m) => clamp(pageIdx, 0, m.maxStart);

  function scrollToPage(track, slides, pageIdx, metrics, state) {
    const startIndex = getStartIndexForPage(pageIdx, metrics);
    const target = slides[startIndex];
    if (!target) return;

    state.animating = true;
    state.targetLeft = target.offsetLeft;

    // safety: clear earlier timer, set a new one (in case scrollend never fires)
    if (state.animTimer) clearTimeout(state.animTimer);
    state.animTimer = setTimeout(() => { state.animating = false; state.targetLeft = null; }, 1200);

    track.scrollTo({ left: state.targetLeft, behavior: 'smooth' });
  }

  function updateActiveDot(carousel, pageIdx) {
    const dots = carousel.querySelectorAll('.pfd-carousel__dot');
    dots.forEach((d, i) => {
      const isActive = i === pageIdx;
      d.toggleAttribute('aria-current', isActive);
      d.setAttribute('aria-selected', isActive ? 'true' : 'false');
      d.classList.toggle('is-active', isActive);
    });
  }

  function getStartIndexFromScroll(track, metrics) {
    const span = metrics.itemSpan || 1;
    const frac = track.scrollLeft / span;
    const EPS = 0.05; // small tolerance for subpixel/momentum
    const idx = Math.round(frac + (frac >= 0 ? EPS : -EPS));
    return clamp(idx, 0, metrics.maxStart);
  }

  const computeCurrentPageFromScroll = (track, metrics) => getStartIndexFromScroll(track, metrics);

  function initCarousel(carousel) {
    if (carousel.dataset.pfdCarouselInitialized === 'true') return;

    const track = carousel.querySelector('.pfd-carousel__track');
    if (!track) return;
    const slides = Array.from(track.children);
    if (!slides.length) return;

    let metrics = getMetrics(track, slides);
    let dots = buildDots(carousel, metrics.totalPages);

    // hide dots when single page
    if (metrics.totalPages <= 1) dots.setAttribute('hidden', ''); else dots.removeAttribute('hidden');

    const state = {
      animating: false,
      targetLeft: null,
      animTimer: null,
      scrollEndTimer: null,
      expectedPage: 0
    };

    function setPageImmediate(idx) {
      state.expectedPage = idx;
      updateActiveDot(carousel, idx);
    }

    function goToPage(idx) {
      setPageImmediate(idx);               
      scrollToPage(track, slides, idx, metrics, state);  
    }

    function attachDotHandlers(dotsEl) {
      dotsEl.addEventListener('click', (e) => {
        const btn = e.target.closest('.pfd-carousel__dot');
        if (!btn) return;
        const idx = parseInt(btn.dataset.index || '0', 10) || 0;
        goToPage(idx);
      });
    }
    attachDotHandlers(dots);

    function finalizeActive() {
      if (state.animating && state.targetLeft != null) {
        const dist = Math.abs(track.scrollLeft - state.targetLeft);
        if (dist > (metrics.itemSpan * 0.25)) return;
      }

      metrics = getMetrics(track, slides);
      const page = computeCurrentPageFromScroll(track, metrics);
      state.expectedPage = page;
      state.animating = false;
      state.targetLeft = null;
      if (state.animTimer) { clearTimeout(state.animTimer); state.animTimer = null; }
      updateActiveDot(carousel, page);
    }

    let ticking = false;
    const SCROLL_END_DELAY = 280;

    function onScroll() {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        if (state.animating && state.targetLeft != null) {
          const dist = Math.abs(track.scrollLeft - state.targetLeft);
          if (dist <= (metrics.itemSpan * 0.25)) {
            finalizeActive();
          } else {
            
          }
        } else {
          const page = computeCurrentPageFromScroll(track, metrics);
          state.expectedPage = page;
          updateActiveDot(carousel, page);
        }

        if (state.scrollEndTimer) clearTimeout(state.scrollEndTimer);
        state.scrollEndTimer = setTimeout(finalizeActive, SCROLL_END_DELAY);

        ticking = false;
      });
    }
    track.addEventListener('scroll', onScroll, { passive: true });

    if ('onscrollend' in window || 'onscrollend' in track) {
      track.addEventListener('scrollend', finalizeActive);
    }

    // On resize: preserve page, rebuild dots if model changes, realign scroll
    function onResize() {
      const prevPage = computeCurrentPageFromScroll(track, metrics);
      const next = getMetrics(track, slides);
      const modelChanged = (next.totalPages !== metrics.totalPages) || (next.visible !== metrics.visible);
      metrics = next;

      if (modelChanged) {
        dots = buildDots(carousel, metrics.totalPages);
        if (metrics.totalPages <= 1) dots.setAttribute('hidden', ''); else dots.removeAttribute('hidden');
        attachDotHandlers(dots);

        const startIdx = getStartIndexForPage(prevPage, metrics);
        const target = slides[startIdx];
        if (target) {
          track.scrollTo({ left: target.offsetLeft, behavior: 'auto' });
        }
      }

      requestAnimationFrame(() => {
        const page = computeCurrentPageFromScroll(track, metrics);
        state.expectedPage = page;
        updateActiveDot(carousel, page);
      });
    }
    window.addEventListener('resize', onResize);

    // Init
    state.expectedPage = computeCurrentPageFromScroll(track, metrics);
    updateActiveDot(carousel, state.expectedPage);

    carousel.dataset.pfdCarouselInitialized = 'true';
  }

  function initAll() {
    document.querySelectorAll('.pfd-carousel').forEach(initCarousel);
  }

  window.addEventListener('DOMContentLoaded', initAll);
  window.addEventListener('load', initAll);
})();