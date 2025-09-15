// Toggle .is-scrolled when the page is scrolled away from the very top
(function () {
  if (typeof window === 'undefined') return;

  const update = () => {
    document.body.classList.toggle('is-scrolled', window.scrollY > 0);
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('load', update);
  document.addEventListener('DOMContentLoaded', update);
})();

// Compute admin bar offset for safe sticky positioning
(function () {
  if (typeof window === 'undefined') return;

  function getAdminBarOffset() {
    let bar = document.getElementById('wpadminbar');
    if (!bar) return 0;
    let cs = getComputedStyle(bar);
    let isFixed = cs.position === 'fixed';
    return isFixed ? (bar.offsetHeight || bar.getBoundingClientRect().height || 0) : 0;
  }

  function updateAdminBarOffsetlet() {
    let root = document.documentElement;
    let h = getAdminBarOffset();
    root.style.setProperty('--pfd-admin-bar-offset', (h || 0) + 'px');
  }

  window.addEventListener('DOMContentLoaded', updateAdminBarOffsetlet);
  window.addEventListener('load', updateAdminBarOffsetlet);
  window.addEventListener('resize', updateAdminBarOffsetlet);
})();

// Flippable Cards
(function() {
  if (typeof window === 'undefined') return;

  function setHidden(face, hidden) {
    face.setAttribute('aria-hidden', hidden ? 'true' : 'false');
    face.querySelectorAll('a,button,input,select,textarea,[tabindex]').forEach((el) => {
      if (hidden) {
        if (!el.hasAttribute('data-prev-tabindex')) {
          el.setAttribute('data-prev-tabindex', el.getAttribute('tabindex') ?? '');
        }
        el.setAttribute('tabindex','-1');
      } else {
        let prev = el.getAttribute('data-prev-tabindex');
        if (prev === '' || prev === null) el.removeAttribute('tabindex');
        else el.setAttribute('tabindex', prev);
        el.removeAttribute('data-prev-tabindex');
      }
    });
  }

  function syncHeight(card) {
    let front = card.querySelector('.pfd-flip__front');
    let back  = card.querySelector('.pfd-flip__back');
    let inner = card.querySelector('.pfd-flip__inner');
    if (!front || !back || !inner) return;

    let flipped = card.classList.contains('is-flipped');
    card.classList.remove('is-flipped');

    let prev = inner.style.transform;
    inner.style.transform = 'none';

    let pf = front.style.position, pb = back.style.position;
    front.style.position = back.style.position = 'static';

    let computedMin = parseFloat(getComputedStyle(card).minHeight) || 0;
    let baseline = Math.max(250, computedMin);
    let h = Math.max(front.offsetHeight, back.offsetHeight, baseline);
    card.style.minHeight = h + 'px';

    front.style.position = pf; back.style.position = pb;
    inner.style.transform = prev;
    if (flipped) card.classList.add('is-flipped');
  }

  function flip(card, toBack) {
    let front = card.querySelector('.pfd-flip__front');
    let back  = card.querySelector('.pfd-flip__back');
    if (!front || !back) return;
    card.classList.toggle('is-flipped', !!toBack);
    setHidden(front, !!toBack);
    setHidden(back, !toBack);
  }

  function initCard(card) {
    let front = card.querySelector('.pfd-flip__front');
    let back  = card.querySelector('.pfd-flip__back');
    if (!front || !back) return;
    setHidden(front, false);
    setHidden(back, true);
    syncHeight(card);
  }

  function initAll() { 
    document.querySelectorAll('.pfd-flip').forEach(initCard); 
  }

  document.addEventListener('click', (e) => {
    let flipA = e.target.closest('.wp-block-button.js-flip .wp-block-button__link');
    if (flipA) { 
      e.preventDefault(); 
      flip(flipA.closest('.pfd-flip'), true); 
      return; 
    }

    let unflipA = e.target.closest('.wp-block-button.js-unflip .wp-block-button__link');
    if (unflipA) { 
      e.preventDefault(); 
      flip(unflipA.closest('.pfd-flip'), false); 
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      let card = document.querySelector('.pfd-flip.is-flipped');
      if (card) flip(card, false);
    }
  });

  window.addEventListener('load', initAll);
  window.addEventListener('resize', () => {
    document.querySelectorAll('.pfd-flip').forEach(syncHeight);
  });
})();

// Details Block Accordion Behaviour
(function () {
  if (typeof window === 'undefined') return;

  function handleDetailsToggle(event) {
    const toggled = event.target;
    if (!toggled || toggled.tagName !== 'DETAILS') return;
    if (!toggled.classList.contains('wp-block-details')) return;

    if (!toggled.open) return;

    // Scope to nearest Group block
    const group = toggled.closest('.wp-block-group');
    if (!group) return;

    // Close any other open details inside the same group
    group.querySelectorAll('details.wp-block-details[open]').forEach((d) => {
      if (d !== toggled && !d.contains(toggled) && !toggled.contains(d)) {
        d.open = false;
      }
    });
  }

  document.addEventListener('toggle', handleDetailsToggle, true);

  function enforceInitialDetailsState() {
    document.querySelectorAll('.wp-block-group').forEach((group) => {
      const openDetails = Array.from(group.querySelectorAll('details.wp-block-details[open]'));
      if (openDetails.length > 1) {
        openDetails.slice(1).forEach((d) => { d.open = false; });
      }
    });
  }

  window.addEventListener('DOMContentLoaded', enforceInitialDetailsState);
  window.addEventListener('load', enforceInitialDetailsState);
})();


// Outline Button Color Freeze
(function () {
  if (typeof window === 'undefined') return;

  function setOutlineVars(root = document) {
    const links = root.querySelectorAll('.wp-block-button.is-style-outline > .wp-block-button__link');
    links.forEach((el) => {
      const cs = getComputedStyle(el);
      const c = cs.color || '';
      if (c) el.style.setProperty('--pfd-outline-color', c);
    });
  }

  // init
  window.addEventListener('DOMContentLoaded', () => setOutlineVars());
  window.addEventListener('load', () => setOutlineVars());

  const obs = new MutationObserver((muts) => {
    for (const m of muts) {
      if (m.addedNodes && m.addedNodes.length) {
        m.addedNodes.forEach((n) => {
          if (!(n instanceof Element)) return;
          if (n.matches?.('.wp-block-button.is-style-outline, .wp-block-buttons')) {
            setOutlineVars(n);
          } else {
            const inner = n.querySelector?.('.wp-block-button.is-style-outline > .wp-block-button__link');
            if (inner) setOutlineVars(n);
          }
        });
      }
    }
  });
  obs.observe(document.documentElement, { childList: true, subtree: true });
})();