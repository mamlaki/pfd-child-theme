(function () {
  if (typeof window === 'undefined') return;

  function parsePx(value) {
    if (!value || value === 'normal') return 0;
    let n = parseFloat(value);
    return isNaN(n) ? 0 : n;
  }

  function getMetrics(track, slides) {
    const style = getComputedStyle(track);
    const gap = parsePx(style.columnGap || style.gap);
    const firstSlide = slides[0];
    const slideWidth = firstSlide ? firstSlide.getBoundingClientRect().width : track.clientWidth;

    let itemSpan = 0;
    if (slides.length >= 2) {
      itemSpan = slides[1].offsetLeft - slides[0].offsetLeft;
    }
    if (itemSpan <= 0) {
      itemSpan = slideWidth + gap;
    }

    const visible = Math.max(1, Math.round(track.clientWidth / (itemSpan || 1)));
    const totalSlides = slides.length;
    const totalPages = Math.max(1, Math.ceil(totalSlides / visible));
    return { gap, slideWidth, itemSpan, visible, totalSlides, totalPages };
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

  function getStartIndexForPage(pageIdx, visible, totalSlides) {
    const maxStart = Math.max(0, totalSlides - visible);
    const start = Math.min(maxStart, Math.max(0, pageIdx * visible));
    return start;
  }

  function scrollToPage(track, slides, pageIdx, metrics) {
    const startIndex = getStartIndexForPage(pageIdx, metrics.visible, metrics.totalSlides);
    const target = slides[startIndex];
    if (!target) return;
    track.scrollTo({ left: target.offsetLeft, behavior: 'smooth' });
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

  function getIndexNearestViewportCenter(track, slides) {
    const centerX = track.scrollLeft + track.clientWidth / 2;
    let bestIndex = 0;
    let bestDist = Infinity;
    for (let i = 0; i < slides.length; i++) {
      const slideCenter = slides[i].offsetLeft + slides[i].offsetWidth / 2;
      const dist = Math.abs(slideCenter - centerX);
      if (dist < bestDist) {
        bestDist = dist;
        bestIndex = i;
      }
    }
    return bestIndex;
  }

  function computeCurrentPage(track, slides, metrics) {
    if (metrics.totalPages <= 1) return 0;
    const centerIndex = getIndexNearestViewportCenter(track, slides);
    const pageIdx = Math.min(
      metrics.totalPages - 1,
      Math.max(0, Math.floor(centerIndex / metrics.visible))
    );
    return pageIdx;
  }

  function initCarousel(carousel) {
    if (carousel.dataset.pfdCarouselInitialized === 'true') return;
    const track = carousel.querySelector('.pfd-carousel__track');
    if (!track) return;

    const slides = Array.from(track.children);
    if (slides.length === 0) return;

    let metrics = getMetrics(track, slides);
    let dots = buildDots(carousel, metrics.totalPages);

    // Hide dots if only one page
    if (metrics.totalPages <= 1) {
      dots.setAttribute('hidden', '');
    } else {
      dots.removeAttribute('hidden');
    }

    function goToPage(idx) {
      scrollToPage(track, slides, idx, metrics);
      
      requestAnimationFrame(() => {
        const page = computeCurrentPage(track, slides, metrics);
        updateActiveDot(carousel, page);
      });
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

    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        metrics = getMetrics(track, slides); 
        const page = computeCurrentPage(track, slides, metrics);
        updateActiveDot(carousel, page);
        ticking = false;
      });
    }
    track.addEventListener('scroll', onScroll, { passive: true });

    // Resize handler 
    let lastVisible = metrics.visible;
    function onResize() {
      const next = getMetrics(track, slides);
      const visibleChanged = next.visible !== lastVisible || next.totalPages !== metrics.totalPages;
      metrics = next;
      if (visibleChanged) {
        dots = buildDots(carousel, metrics.totalPages);
        if (metrics.totalPages <= 1) dots.setAttribute('hidden', ''); else dots.removeAttribute('hidden');
        attachDotHandlers(dots);
        lastVisible = metrics.visible;
      }
      const page = computeCurrentPage(track, slides, metrics);
      updateActiveDot(carousel, page);
    }
    window.addEventListener('resize', onResize);

    // Initialize active dot
    updateActiveDot(carousel, computeCurrentPage(track, slides, metrics));

    carousel.dataset.pfdCarouselInitialized = 'true';
  }

  function initAll() {
    document.querySelectorAll('.pfd-carousel').forEach(initCarousel);
  }

  window.addEventListener('DOMContentLoaded', initAll);
  window.addEventListener('load', initAll);
})();


