(function () {
  if (typeof window === 'undefined') return;

  function slugify(text) {
    return (text || '')
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  function ensureHeadingIds(headings, idPrefix) {
    const used = new Set();
    headings.forEach((h, i) => {
      if (!h.id) {
        let base = slugify(h.textContent) || `section-${i+1}`;
        let id = base;
        let n = 2;

        while (used.has(id) || document.getElementById(id)) {
          id = `${base}-${n++}`;
        }
        h.id = idPrefix ? `${idPrefix}-${id}` : id;

        used.add(h.id);
      }
    });
  }

  function buildNestedList(headings) {
    // Build nested UL based on h levels
    const rootUl = document.createElement('ul');
    rootUl.className = 'pfd-toc__list-root';
    let currentLevel = 2;
    let currentUl = rootUl;
    const ulStack = [rootUl];

    headings.forEach(h => {
      const level = Math.min(Number(h.tagName.substring(1)), 4);
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#${h.id}`;
      a.textContent = h.textContent.trim();
      a.className = 'pfd-toc__link';
      li.appendChild(a);

      if (level > currentLevel) {
        for (let l = currentLevel + 1; l <= level; l++) {
          const newUl = document.createElement('ul');
          newUl.className = 'pfd-toc__sublist';
          const lastLi = currentUl.lastElementChild;

          if (lastLi) {
            lastLi.appendChild(newUl);
          } else {
            currentUl.appendChild(newUl);
          }

          ulStack.push(newUl);
          currentUl = newUl;
        }
      } else if (level < currentLevel) {
        for (let l = currentLevel - 1; l >= Math.max(level, 2); l--) {
          ulStack.pop();
          currentUl = ulStack[ulStack.length - 1] || rootUl;
        }
      }

      currentUl.appendChild(li);
      currentLevel = level;
    });

    return rootUl;
  }

  function createModal(id) {
    const overlay = document.createElement('div');
    overlay.id = id;
    overlay.className = 'pfd-toc-modal';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('hidden', '');

    const sheet = document.createElement('div');
    sheet.className = 'pfd-toc-modal__sheet';
    overlay.appendChild(sheet);

    const header = document.createElement('div');
    header.className = 'pfd-toc-modal__header';
    header.innerHTML = '<span class="pfd-toc-modal__title">On this page</span>';
    sheet.appendChild(header);

    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'pfd-toc-modal__close';
    close.setAttribute('aria-label', 'Close table of contents');
    close.innerHTML = '\u2715';
    header.appendChild(close);

    const content = document.createElement('div');
    content.className = 'pfd-toc-modal__content';
    sheet.appendChild(content);

    document.body.appendChild(overlay);
    return { overlay, sheet, close, content };
  }

  function getAdminBarHeight() {
    const el = document.getElementById('wpadminbar');
    if (el && getComputedStyle(el).position !== 'fixed') {
      return el.offsetHeight || 0;
    }
    return el ? el.offsetHeight || 0 : 0;
  }

  function computeAndSetStickyOffsetVar() {
    const root = document.documentElement;
    const stickyEl = document.querySelector('header .is-position-sticky')
      || document.querySelector('.is-position-sticky')
      || document.querySelector('header');
    const headerHeight = stickyEl ? (stickyEl.getBoundingClientRect().height || stickyEl.offsetHeight || 0) : 0;
    const extraGap = 16; // add a little more breathing room below the header
    const finalOffset = Math.max(0, headerHeight) + extraGap;
    root.style.setProperty('--pfd-sticky-offset', `${finalOffset}px`);
  }

  function enableSmoothScroll(container) {
    container.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const hash = link.getAttribute('href');
      const id = hash.slice(1);
      const target = id ? document.getElementById(id) : null;
      if (target) {
        e.preventDefault();
        // Account for header
        const stickyOffset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--pfd-sticky-offset')) || 16;
        const adminBar = getAdminBarHeight();
        const offset = adminBar + stickyOffset;
        const rect = target.getBoundingClientRect();
        const y = window.scrollY + rect.top - offset;
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
        history.pushState(null, '', `#${id}`);
      }
    });
  }

  function observeActive(headings, linkMap) {
    if (!('IntersectionObserver' in window)) return;
    let currentId = null;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.id;
        const link = linkMap.get(id);
        if (!link) return;
        if (entry.isIntersecting) {
          currentId = id;
          linkMap.forEach(a => a.removeAttribute('aria-current'));
          link.setAttribute('aria-current', 'true');
        } else if (currentId === id && entry.boundingClientRect.top > 0) {
          link.removeAttribute('aria-current');
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -70% 0px',
      threshold: 0.01
    });

    headings.forEach(h => observer.observe(h));
  }

  function initInstance(tocEl) {
    if (tocEl.dataset.tocInitialized === 'true') return;
    const columns = tocEl.closest('.wp-block-columns');
    if (!columns) return;
    const content = columns.querySelector('.pfd-toc__content');
    if (!content) return;

    const listHost = tocEl.querySelector('.pfd-toc__list');
    if (!listHost) return;

    const headings = Array.from(content.querySelectorAll('h2, h3, h4'));
    if (!headings.length) {
      tocEl.classList.add('is-empty');
      const fab = columns.querySelector('.pfd-toc__fab');
      if (fab) fab.setAttribute('hidden', '');
      return;
    }

    const idPrefix = `toc${Math.random().toString(36).slice(2, 7)}`;
    ensureHeadingIds(headings, '');

    const built = buildNestedList(headings);
    listHost.innerHTML = '';
    listHost.appendChild(built);

    // Smooth scroll 
    enableSmoothScroll(listHost);

    // Active section highlight
    const linkMap = new Map();

    listHost.querySelectorAll('a[href^="#"]').forEach(a => {
      const id = a.getAttribute('href').slice(1);
      if (id) linkMap.set(id, a);
    });

    observeActive(headings, linkMap);

    // Modal for mobile
    const wrapper = tocEl.closest('.pfd-toc-pattern') || columns;
    const fabButton = wrapper.querySelector('.pfd-toc__fab .wp-block-button__link');

    if (fabButton) {
      const modalId = `pfd-toc-modal-${idPrefix}`;
      if (document.getElementById(modalId)) return;
      fabButton.setAttribute('aria-controls', modalId);

      const modal = createModal(modalId);
      modal.content.appendChild(built.cloneNode(true));

      enableSmoothScroll(modal.content);

      function openModal() {
        modal.overlay.removeAttribute('hidden');
        document.body.classList.add('pfd-toc-modal-open');
        fabButton.setAttribute('aria-expanded', 'true');
        // focus first link
        const first = modal.content.querySelector('a');
        if (first) first.focus({ preventScroll: true });
      }

      function closeModal() {
        modal.overlay.setAttribute('hidden', '');
        document.body.classList.remove('pfd-toc-modal-open');
        fabButton.setAttribute('aria-expanded', 'false');
        fabButton.focus({ preventScroll: true });
      }

      fabButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (modal.overlay.hasAttribute('hidden')) openModal(); else closeModal();
      });

      modal.close.addEventListener('click', closeModal);
      modal.overlay.addEventListener('click', (e) => {
        if (e.target === modal.overlay) closeModal();
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.overlay.hasAttribute('hidden')) closeModal();
      });
      modal.content.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (link) closeModal();
      });
    }

    tocEl.dataset.tocInitialized = 'true';
  }

  function initAll() {
    computeAndSetStickyOffsetVar();
    document.querySelectorAll('.pfd-toc').forEach(initInstance);
  }

  window.addEventListener('DOMContentLoaded', initAll);
  window.addEventListener('load', initAll);
  window.addEventListener('resize', computeAndSetStickyOffsetVar);
})();


