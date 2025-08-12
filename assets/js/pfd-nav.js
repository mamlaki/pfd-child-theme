(function () {
  document.addEventListener(
    'pointerdown',
    function (e) {
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
    
    document.documentElement.classList.remove('has-modal-open');
    document.body.classList.remove('has-modal-open');
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
})();