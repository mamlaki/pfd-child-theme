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