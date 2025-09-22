(function () {
  var scrollLockState = null;
  var navOpenButtonRects = new WeakMap();

  function activateScrollLock() {
    if (scrollLockState) return;
    var y = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    scrollLockState = {
      scrollY: y,
      prev: {
        position: document.body.style.position,
        top: document.body.style.top,
        width: document.body.style.width,
        left: document.body.style.left
      }
    };
    document.documentElement.classList.add('has-modal-open');
    document.body.classList.add('has-modal-open');
    document.body.style.position = 'fixed';
    document.body.style.top = '-' + y + 'px';
    document.body.style.width = '100%';
    document.body.style.left = '0';
  }

  function deactivateScrollLock() {
    if (!scrollLockState) return;
    document.documentElement.classList.remove('has-modal-open');
    document.body.classList.remove('has-modal-open');
    document.body.style.position = scrollLockState.prev.position;
    document.body.style.top = scrollLockState.prev.top;
    document.body.style.width = scrollLockState.prev.width;
    document.body.style.left = scrollLockState.prev.left;
    window.scrollTo(0, scrollLockState.scrollY);
    scrollLockState = null;
  }

  function anyMenuOpen() {
    return !!document.querySelector('.wp-block-navigation__responsive-container.is-menu-open');
  }

  function syncScrollLock() {
    if (anyMenuOpen()) activateScrollLock();
    else deactivateScrollLock();
  }

  function rememberOpenButtonRect(btn) {
    if (!btn) return;
    var navRoot = btn.closest('.wp-block-navigation.is-style-pfd-nav');
    if (!navRoot) return;
    var rect = btn.getBoundingClientRect();
    if (!rect || (!rect.width && !rect.height)) return;
    navOpenButtonRects.set(navRoot, {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height
    });
  }

  function readOpenButtonRect(navRoot) {
    if (!navRoot) return null;
    var openBtn = navRoot.querySelector('.wp-block-navigation__responsive-container-open');
    if (openBtn && openBtn.offsetParent !== null) {
      var liveRect = openBtn.getBoundingClientRect();
      if (liveRect && (liveRect.width || liveRect.height)) return liveRect;
    }
    return navOpenButtonRects.get(navRoot) || null;
  }

  function syncCloseButtonPosition(navRoot) {
    if (!navRoot) return;
    var container = navRoot.querySelector('.wp-block-navigation__responsive-container');
    if (!container) return;
    var closeBtn = container.querySelector('.wp-block-navigation__responsive-container-close');
    if (!closeBtn) return;

    if (!container.classList.contains('is-menu-open')) {
      closeBtn.style.position = '';
      closeBtn.style.top = '';
      closeBtn.style.left = '';
      closeBtn.style.right = '';
      closeBtn.style.bottom = '';
      closeBtn.style.width = '';
      closeBtn.style.height = '';
      closeBtn.style.transform = '';
      closeBtn.style.margin = '';
      closeBtn.style.alignItems = '';
      closeBtn.style.justifyContent = '';
      closeBtn.style.zIndex = '';
      closeBtn.style.pointerEvents = '';
      return;
    }

    var rect = readOpenButtonRect(navRoot);
    if (!rect) return;

    closeBtn.style.position = 'fixed';
    closeBtn.style.top = rect.top + 'px';
    closeBtn.style.left = rect.left + 'px';
    closeBtn.style.right = 'auto';
    closeBtn.style.bottom = 'auto';
    closeBtn.style.width = rect.width + 'px';
    closeBtn.style.height = rect.height + 'px';
    closeBtn.style.transform = 'translate(0, 0)';
    closeBtn.style.margin = '0';
    closeBtn.style.alignItems = 'center';
    closeBtn.style.justifyContent = 'center';
    closeBtn.style.zIndex = '10001';
    closeBtn.style.pointerEvents = 'auto';
  }

  function syncAllCloseButtonPositions() {
    document.querySelectorAll('.wp-block-navigation.is-style-pfd-nav').forEach(function (nav) {
      syncCloseButtonPosition(nav);
    });
  }

  document.addEventListener(
    'pointerdown',
    function (e) {
      var openToggle = e.target.closest('.wp-block-navigation__responsive-container-open');
      if (openToggle) rememberOpenButtonRect(openToggle);
      const scrim = e.target.closest('.wp-block-navigation__responsive-close');
      if (scrim && !e.target.closest('.wp-block-navigation__responsive-dialog')) {
        e.stopPropagation();
        e.preventDefault();
      }
    },
    true
  );

  document.addEventListener(
    'click',
    function (e) {
      var openToggle = e.target.closest('.wp-block-navigation__responsive-container-open');
      if (openToggle) rememberOpenButtonRect(openToggle);
      // Let the explicit X button close as normal.
      if (e.target.closest('.wp-block-navigation__responsive-container-close')) return;

      const scrim = e.target.closest('.wp-block-navigation__responsive-close');
      if (scrim && !e.target.closest('.wp-block-navigation__responsive-dialog')) {
        e.stopPropagation();
        e.preventDefault();
      }
    },
    true
  );

  // Stop focus auto close
  document.addEventListener(
    'focusout',
    function (e) {
      const container = e.target.closest('.wp-block-navigation__responsive-container');
      if (!container || !container.classList.contains('is-menu-open')) return;

      if (e.target.closest('.wp-block-navigation__responsive-container-close')) return;

      e.stopPropagation();
    },
    true
  );

  // PFD Nav Mobile Accordion
  function levelContainerFor(btn) {
    return btn.closest('.wp-block-navigation__submenu-container, .wp-block-navigation__container');
  }

  function closeBranch(rootLi) {
    rootLi?.querySelectorAll('button.wp-block-navigation-submenu__toggle[aria-expanded="true"]')
      .forEach(b => b.setAttribute('aria-expanded', 'false'));
  }

  function closeSiblings(btn) {
    const level = levelContainerFor(btn);
    if (!level) return;
    level.querySelectorAll(':scope > li.has-child > button.wp-block-navigation-submenu__toggle[aria-expanded="true"]')
      .forEach(other => {
        if (other === btn) return;
        other.setAttribute('aria-expanded', 'false');
        closeBranch(other.closest('li'));
      });
  }

  function toggleSubmenu(btn) {
    const drawer = btn.closest('.wp-block-navigation__responsive-container.is-menu-open');
    if (!drawer) return;

    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      // Close self
      btn.setAttribute('aria-expanded', 'false');
      closeBranch(btn.closest('li'));
    } else {
      // Open self
      closeSiblings(btn);
      btn.setAttribute('aria-expanded', 'true');
    }
  }

  // Intercept toggle clicks
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('button.wp-block-navigation-submenu__toggle');
    if (!btn) return;
    if (!btn.closest('.wp-block-navigation__responsive-container.is-menu-open')) return;

    e.preventDefault();
    e.stopImmediatePropagation();
    toggleSubmenu(btn);
  }, true);

  document.addEventListener('keydown', function (e) {
    var openToggle = e.target.closest('.wp-block-navigation__responsive-container-open');
    if (openToggle && (e.key === 'Enter' || e.key === ' ')) {
      rememberOpenButtonRect(openToggle);
      // allow WordPress default to open menu after we capture.
    }
    const btn = e.target.closest('button.wp-block-navigation-submenu__toggle');
    if (!btn) return;
    if (!btn.closest('.wp-block-navigation__responsive-container.is-menu-open')) return;

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopImmediatePropagation();
      toggleSubmenu(btn);
    }
  }, true);
  
  // Breakpoint Reset – Clear Mobile UI on Resize
  var mqDesktop = window.matchMedia('(min-width: 1200px)');
  
  function closeMobileOverlay(navRoot) {
    navRoot.querySelectorAll('.wp-block-navigation__responsive-container.is-menu-open')
      .forEach((c) => c.classList.remove('is-menu-open'));
    syncScrollLock();
    syncCloseButtonPosition(navRoot);
  }

  function collapseMobileSubmenus(navRoot) {
    navRoot.querySelectorAll('.wp-block-navigation-submenu__toggle[aria-expanded="true"]')
      .forEach((btn) => btn.setAttribute('aria-expanded', 'false'));
  }

  function clearNavFocus(navRoot) {
    var active = document.activeElement;
    if (active && navRoot.contains(active) && typeof active.blur === 'function') active.blur();
  }

  function hardResetNavs() {
    document.querySelectorAll('.wp-block-navigation.is-style-pfd-nav').forEach((nav) => {
      collapseMobileSubmenus(nav);
      closeMobileOverlay(nav);
      clearNavFocus(nav);
    });
  }

  if (typeof mqDesktop.addEventListener === 'function') {
    mqDesktop.addEventListener('change', (e) => {
      if (e.matches) hardResetNavs();
    })
  } else {
    mqDesktop.addListener('change', (e) => {
      if (e.matches) hardResetNavs();
    });
  }

  function observeResponsiveState(navRoot) {
    if (!navRoot || navRoot.dataset.pfdNavObserved === '1') return;
    var container = navRoot.querySelector('.wp-block-navigation__responsive-container');
    if (!container) return;
    navRoot.dataset.pfdNavObserved = '1';

    var observer = new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        if (mutations[i].attributeName === 'class') {
          syncScrollLock();
          syncCloseButtonPosition(navRoot);
          break;
        }
      }
    });

    observer.observe(container, { attributes: true, attributeFilter: ['class'] });
    syncScrollLock();
    syncCloseButtonPosition(navRoot);
  }

  function initResponsiveObservers() {
    document.querySelectorAll('.wp-block-navigation.is-style-pfd-nav').forEach(observeResponsiveState);
  }

  window.addEventListener('DOMContentLoaded', initResponsiveObservers);
  window.addEventListener('load', initResponsiveObservers);
  window.addEventListener('resize', syncAllCloseButtonPositions);
})();
