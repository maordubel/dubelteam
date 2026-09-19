/* ============================================================
   DUBEL TEAM — Shared behaviour
   Sticky nav · mobile menu · fade-up on scroll · stat counters
   Guarded so the same file works on every page.
   ============================================================ */
(function () {
  'use strict';

  // Current year in footer
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Privacy link — keep the required policy reachable from shared pages
  var footerLinks = document.querySelector('.footer-links');
  if (footerLinks && !footerLinks.querySelector('a[href$="privacy.html"]')) {
    var privacyLink = document.createElement('a');
    privacyLink.href = '/privacy.html';
    privacyLink.textContent = 'Privacy';
    footerLinks.appendChild(privacyLink);
  }

  // Add The Worker to the shared footer without removing any existing product.
  var footerApps = document.querySelector('.footer-apps');
  if (footerApps && !footerApps.querySelector('a[href*="theworker.dubelteam.com"]')) {
    var workerFooterLink = document.createElement('a');
    workerFooterLink.href = 'https://theworker.dubelteam.com/';
    workerFooterLink.target = '_blank';
    workerFooterLink.rel = 'noopener';
    workerFooterLink.textContent = 'The Worker ↗';
    var teamButton = footerApps.querySelector('[data-team-open]');
    if (teamButton) footerApps.insertBefore(workerFooterLink, teamButton);
    else footerApps.appendChild(workerFooterLink);
  }

  // Homepage: use the existing sixth product-card slot for The Worker.
  // This changes content only; card markup/classes/layout stay exactly the same.
  var homeProductGrid = document.querySelector('#products .prod-grid');
  if (homeProductGrid) {
    var artCard = homeProductGrid.querySelector('a[href*="art.dubelteam.com"]');
    if (artCard && !homeProductGrid.querySelector('a[href*="theworker.dubelteam.com"]')) {
      artCard.href = 'https://theworker.dubelteam.com/';
      var badge = artCard.querySelector('.prod-badge');
      if (badge) {
        badge.classList.remove('soft');
        badge.textContent = 'Interactive archive · Football';
      }
      var shot = artCard.querySelector('.prod-shot img');
      if (shot) {
        shot.src = 'prod-theworker.svg';
        shot.alt = 'The Worker — interactive football history, supporter memories and archive';
      }
      var name = artCard.querySelector('.prod-name');
      if (name) name.innerHTML = 'THE <span class="it">Worker</span>';
      var line = artCard.querySelector('.prod-line');
      if (line) line.textContent = 'Football history you can enter.';
      var desc = artCard.querySelector('.prod-desc');
      if (desc) desc.textContent = 'An interactive Hapoel Tel Aviv universe combining a narrative supporter game, historical archive, timeline, trivia, shirts, line-ups, memories and fan culture — built around real events and designed for repeat exploration.';
      var cta = artCard.querySelector('.prod-cta');
      if (cta) cta.textContent = 'Enter The Worker →';
      var url = artCard.querySelector('.prod-url');
      if (url) url.textContent = 'theworker.dubelteam.com';
    }
  }

  // Products page: append The Worker using the existing product article structure.
  var platformList = document.querySelector('.plat-list');
  if (platformList && /\/platforms\.html$/.test(window.location.pathname) && !document.getElementById('the-worker')) {
    var workerArticle = document.createElement('article');
    workerArticle.className = 'plat fade-up';
    workerArticle.id = 'the-worker';
    workerArticle.innerHTML =
      '<div class="plat-left">' +
        '<div class="pl-index">07</div>' +
        '<div class="pl-tag">Interactive archive · Football</div>' +
        '<a class="pl-url" href="https://theworker.dubelteam.com/" target="_blank" rel="noopener">theworker.dubelteam.com ↗</a>' +
        '<img class="plat-shot" src="prod-theworker.svg" alt="The Worker — interactive football history, supporter memories and archive" loading="lazy" width="800" height="600">' +
      '</div>' +
      '<div>' +
        '<h3>THE <span class="it">Worker</span></h3>' +
        '<p class="pl-line">Football history you can enter.</p>' +
        '<p>An interactive Hapoel Tel Aviv universe combining a narrative supporter game, historical archive, timeline, trivia, shirts, line-ups, memories and fan culture. It is built around real events and designed for exploration rather than a one-time visit.</p>' +
        '<p>The product continues to grow with new eras, research, archive material and interactive gates, giving supporters reasons to return as the historical world expands.</p>' +
        '<div class="pl-specs"><span>Narrative game</span><span>Historical archive</span><span>Timeline</span><span>Trivia &amp; fan culture</span></div>' +
        '<a href="https://theworker.dubelteam.com/" target="_blank" rel="noopener" class="btn btn-primary">Enter The Worker →</a>' +
      '</div>';
    platformList.appendChild(workerArticle);
  }

  // Machine-readable map of the live product ecosystem.
  // It is injected only on the main company/product pages and has no visual effect.
  var path = window.location.pathname;
  var isProductContext = path === '/' || /\/(index|platforms)\.html$/.test(path);
  if (isProductContext && !document.getElementById('dubel-products-jsonld')) {
    var productData = document.createElement('script');
    productData.id = 'dubel-products-jsonld';
    productData.type = 'application/ld+json';
    productData.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'name': 'Dubel Team live digital products',
      'numberOfItems': 6,
      'itemListElement': [
        {'@type':'ListItem','position':1,'name':'The Worker','url':'https://theworker.dubelteam.com/'},
        {'@type':'ListItem','position':2,'name':'TakeMeOut!','url':'https://takemeout.dubelteam.com/'},
        {'@type':'ListItem','position':3,'name':'Dubid','url':'https://dubid.dubelteam.com/'},
        {'@type':'ListItem','position':4,'name':'Offsides','url':'https://offsides.dubelteam.com/'},
        {'@type':'ListItem','position':5,'name':'Retzach','url':'https://retzach.dubelteam.com/'},
        {'@type':'ListItem','position':6,'name':'Fuck You','url':'https://fuckyou.dubelteam.com/'}
      ]
    });
    document.head.appendChild(productData);
  }

  // Sticky nav — add .scrolled once the page moves
  var nav = document.getElementById('nav');
  if (nav) {
    var onScroll = function () {
      if (window.scrollY > 24) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Mobile menu toggle
  var menuToggle = document.getElementById('menuToggle');
  var navLinks = document.getElementById('navLinks');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      menuToggle.textContent = isOpen ? 'Close' : 'Menu';
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navLinks.classList.remove('open');
        menuToggle.textContent = 'Menu';
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Fade-up on scroll
  var fadeEls = document.querySelectorAll('.fade-up');
  var revealAll = function () {
    fadeEls.forEach(function (el) { el.classList.add('in'); });
  };
  if (fadeEls.length) {
    if (!('IntersectionObserver' in window) || reduceMotion) {
      revealAll();
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0, rootMargin: '0px 0px 20% 0px' });
      fadeEls.forEach(function (el) { io.observe(el); });

      // Safety net: never leave content hidden if the observer is slow,
      // the user scrolls fast, or anything else goes wrong.
      window.addEventListener('load', function () {
        setTimeout(function () {
          fadeEls.forEach(function (el) {
            var r = el.getBoundingClientRect();
            if (r.top < window.innerHeight * 1.2) el.classList.add('in');
          });
        }, 300);
      });
      setTimeout(revealAll, 3000);
    }
  }

  // Animated stat counters ([data-count])
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    var runCount = function (el) {
      var target = parseFloat(el.getAttribute('data-count')) || 0;
      if (reduceMotion || !('requestAnimationFrame' in window)) {
        el.textContent = target.toLocaleString('en-US');
        return;
      }
      var duration = 1600, start = null;
      var step = function (ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased).toLocaleString('en-US');
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target.toLocaleString('en-US');
      };
      requestAnimationFrame(step);
    };

    if (!('IntersectionObserver' in window)) {
      counters.forEach(runCount);
    } else {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            runCount(e.target);
            cio.unobserve(e.target);
          }
        });
      }, { threshold: 0.4 });
      counters.forEach(function (el) { cio.observe(el); });
    }
  }

  /* ---------------------------------------------------------------
     WHO'S THE TEAM — modal (present on every shared-CSS page)
     Opens from any [data-team-open]; closes on backdrop, ✕ or Esc.
     Focus is trapped to the panel and restored on close.
     --------------------------------------------------------------- */
  var teamModal = document.getElementById('teamModal');
  if (teamModal) {
    var lastFocused = null;
    var panel = teamModal.querySelector('.team-modal-panel');

    var openTeam = function (trigger) {
      lastFocused = trigger || document.activeElement;
      teamModal.setAttribute('data-open', 'true');
      document.body.classList.add('team-open');
      var closeBtn = teamModal.querySelector('.team-modal-close');
      if (closeBtn) closeBtn.focus();
    };

    var closeTeam = function () {
      teamModal.setAttribute('data-open', 'false');
      document.body.classList.remove('team-open');
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    };

    document.querySelectorAll('[data-team-open]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        openTeam(btn);
      });
    });

    teamModal.querySelectorAll('[data-team-close]').forEach(function (el) {
      el.addEventListener('click', closeTeam);
    });

    document.addEventListener('keydown', function (e) {
      if (teamModal.getAttribute('data-open') !== 'true') return;
      if (e.key === 'Escape') { closeTeam(); return; }
      if (e.key !== 'Tab' || !panel) return;
      var focusable = panel.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (!focusable.length) return;
      var first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }
})();
