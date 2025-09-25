(function () {
  if (typeof window === 'undefined') return;

  const LOCK_STYLE_PROPS = ['position', 'top', 'left', 'right', 'width', 'paddingRight', 'overflow'];
  let scrollLockState = null;
  let fabViewportListenerAttached = false;

  function focusHeadingElement(el) {
    if (!el) return;
    const hadTabIndex = el.hasAttribute('tabindex');
    if (!hadTabIndex) el.setAttribute('tabindex', '-1');
    const focus = () => {
      if (typeof el.focus === 'function') {
        try {
          el.focus({ preventScroll: true });
        } catch (err) {
          el.focus();
        }
      }
      if (!hadTabIndex) {
        const cleanup = () => el.removeAttribute('tabindex');
        if (typeof window.requestAnimationFrame === 'function') {
          window.requestAnimationFrame(() => window.setTimeout(cleanup, 0));
        } else {
          window.setTimeout(cleanup, 0);
        }
      }
    };
    if (typeof window.requestAnimationFrame === 'function') {
      window.requestAnimationFrame(focus);
    } else {
      focus();
    }
  }

  function slugify(text) {
    return (text || '')
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  // Skip form/form plugin headings
  const EXCLUDE_CONTAINERS = [
    'form',
    '.wp-block-jetpack-contact-form',
    '.jetpack-contact-form',
    '.grunion-contact-form',
    '.wpforms-container',
    '.gform_wrapper',
    '.wpcf7',
    '.nf-form-layout',
    '.happyforms-form',
    '.mc4wp-form',
    '.caldera-grid',
    '.pfd-toc-ignore'
  ];

  // Heading selectors to skip
  const EXCLUDE_HEADINGS = [
    '.screen-reader-text',
    '.sr-only',
    '[hidden]',
    '[aria-hidden="true"]'
  ];

  function isHiddenDeep(el) {
    for (let n = el; n && n !== document.body; n = n.parentElement) {
      if (n.hasAttribute('hidden') || n.getAttribute('aria-hidden') === 'true') return true;
      const cs = getComputedStyle(n);
      if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') return true;
    }
    return false;
  }

  function shouldIncludeHeading(h) {
    if (EXCLUDE_HEADINGS.some(sel => h.matches(sel))) return false;
    if (h.closest('[role="status"], [aria-live]')) return false;
    if (EXCLUDE_CONTAINERS.some(sel => h.closest(sel))) return false;
    if (isHiddenDeep(h)) return false;
    const t = (h.textContent || '').trim();
    if (!t || t.length < 2) return false;
    return true;
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

  function buildNestedList(headings, rootUl) {
    // Build nested UL
    const root = rootUl || document.createElement('ul');
    if (!root.classList.contains('pfd-toc__list-root')) {
      root.classList.add('pfd-toc__list-root');
    }
    root.innerHTML = '';

    const listStack = [root];

    headings.forEach(h => {
      const numericLevel = Number(h.tagName.substring(1));
      const level = Number.isFinite(numericLevel) ? Math.min(numericLevel, 4) : 2;
      let depth = Math.max(0, level - 2);

      while (listStack.length - 1 > depth) {
        listStack.pop();
      }

      while (listStack.length - 1 < depth) {
        const parentUl = listStack[listStack.length - 1];
        const lastLi = parentUl.lastElementChild;
        if (!lastLi) {
          depth = listStack.length - 1;
          break;
        }

        const newUl = document.createElement('ul');
        newUl.className = 'pfd-toc__sublist';
        lastLi.appendChild(newUl);
        listStack.push(newUl);
      }

      while (listStack.length - 1 > depth) {
        listStack.pop();
      }

      const currentUl = listStack[listStack.length - 1];
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#${h.id}`;
      a.textContent = h.textContent.trim();
      a.className = 'pfd-toc__link';
      li.appendChild(a);
      currentUl.appendChild(li);
    });

    return root;
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

  function lockBodyScroll() {
    if (scrollLockState) return;
    const body = document.body;
    const docEl = document.documentElement;
    if (!body || !docEl) return;

    const scrollY = window.scrollY || window.pageYOffset || 0;
    const storedStyles = {};
    LOCK_STYLE_PROPS.forEach((prop) => {
      storedStyles[prop] = body.style[prop];
    });

    scrollLockState = {
      scrollY,
      styles: storedStyles,
      restoreBehavior: 'auto',
      docOverflow: docEl.style.overflow,
      pendingId: null
    };

    docEl.classList.add('pfd-toc-modal-open');
    body.classList.add('pfd-toc-modal-open');

    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';

    const scrollbarGap = window.innerWidth - docEl.clientWidth;
    if (scrollbarGap > 0) {
      body.style.paddingRight = `${scrollbarGap}px`;
    }
    body.style.overflow = 'hidden';
    docEl.style.overflow = 'hidden';
  }

  function unlockBodyScroll() {
    if (!scrollLockState) return;
    const state = scrollLockState;
    if (!state) return;
    const { scrollY, styles, restoreBehavior, docOverflow, pendingId } = state;
    const body = document.body;
    const docEl = document.documentElement;
    if (!body || !docEl) return;

    docEl.classList.remove('pfd-toc-modal-open');
    body.classList.remove('pfd-toc-modal-open');

    LOCK_STYLE_PROPS.forEach((prop) => {
      body.style[prop] = styles[prop] || '';
    });
    docEl.style.overflow = docOverflow || '';

    const restore = () => {
      window.scrollTo({ top: scrollY, left: 0, behavior: restoreBehavior || 'auto' });
      if (pendingId) {
        const target = document.getElementById(pendingId);
        if (target) focusHeadingElement(target);
      }
    };
    scrollLockState = null;
    if (typeof window.requestAnimationFrame === 'function') {
      window.requestAnimationFrame(restore);
    } else {
      restore();
    }
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
        const currentScroll = scrollLockState
          ? scrollLockState.scrollY
          : (window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0);
        const y = currentScroll + rect.top - offset;
        const top = Math.max(0, y);
        if (scrollLockState) {
          scrollLockState.scrollY = top;
          scrollLockState.restoreBehavior = 'smooth';
          scrollLockState.pendingId = id;
        } else {
          window.scrollTo({ top, behavior: 'smooth' });
          focusHeadingElement(target);
        }
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

  // Keep the floating action button anchored to the visual viewport
  function updateFabViewportOffset() {
    if (!('visualViewport' in window) || !window.visualViewport) return;
    const viewport = window.visualViewport;
    const delta = window.innerHeight - viewport.height;
    const bottomInset = Math.max(0, delta - viewport.offsetTop);
    const offset = Math.max(0, Math.round(bottomInset));
    document.documentElement.style.setProperty('--pfd-toc-fab-dynamic-offset', `${offset}px`);
  }

  function initFabViewportCompensation() {
    if (!('visualViewport' in window) || !window.visualViewport) return;
    updateFabViewportOffset();
    if (fabViewportListenerAttached) return;
    fabViewportListenerAttached = true;
    const viewport = window.visualViewport;
    const schedule = () => window.requestAnimationFrame(updateFabViewportOffset);
    viewport.addEventListener('resize', schedule);
    viewport.addEventListener('scroll', schedule);
    window.addEventListener('orientationchange', () => {
      window.setTimeout(updateFabViewportOffset, 250);
    });
  }

  function initInstance(tocEl) {
    if (tocEl.dataset.tocInitialized === 'true') return;
    const columns = tocEl.closest('.wp-block-columns');
    if (!columns) return;
    const content = columns.querySelector('.pfd-toc__content');
    if (!content) return;

    const listHost = tocEl.querySelector('.pfd-toc__list');
    if (!listHost) return;

    const headings = Array.from(content.querySelectorAll('h2, h3, h4')).filter(shouldIncludeHeading);
    if (!headings.length) {
      tocEl.classList.add('is-empty');
      const fab = columns.querySelector('.pfd-toc__fab');
      if (fab) fab.setAttribute('hidden', '');
      return;
    }

    const idPrefix = `toc${Math.random().toString(36).slice(2, 7)}`;
    ensureHeadingIds(headings, '');

    const built = buildNestedList(headings, listHost);

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
        lockBodyScroll();
        fabButton.setAttribute('aria-expanded', 'true');
        // focus first link
        const first = modal.content.querySelector('a');
        if (first) first.focus({ preventScroll: true });
      }

      function closeModal(opts = {}) {
        const { restoreFocus = true } = opts;
        modal.overlay.setAttribute('hidden', '');
        unlockBodyScroll();
        fabButton.setAttribute('aria-expanded', 'false');
        if (restoreFocus) {
          try {
            fabButton.focus({ preventScroll: true });
          } catch (err) {
            fabButton.focus();
          }
        }
      }

      fabButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (modal.overlay.hasAttribute('hidden')) openModal(); else closeModal();
      });

      modal.close.addEventListener('click', closeModal);
      modal.overlay.addEventListener('click', (e) => {
        if (e.target === modal.overlay) closeModal();
      });
      modal.overlay.addEventListener('touchmove', (e) => {
        if (!modal.content.contains(e.target)) {
          e.preventDefault();
        }
      }, { passive: false });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.overlay.hasAttribute('hidden')) closeModal();
      });
      modal.content.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (link) closeModal({ restoreFocus: false });
      });
    }

    tocEl.dataset.tocInitialized = 'true';
  }

  function initAll() {
    computeAndSetStickyOffsetVar();
    initFabViewportCompensation();
    document.querySelectorAll('.pfd-toc').forEach(initInstance);
  }

  window.addEventListener('DOMContentLoaded', initAll);
  window.addEventListener('load', initAll);
  window.addEventListener('resize', computeAndSetStickyOffsetVar);
})();
