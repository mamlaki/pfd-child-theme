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