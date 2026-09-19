/* ============================================================
   DUBEL TEAM — Shared behaviour
   Sticky nav · mobile menu · fade-up · counters · shared footer
   ============================================================ */
(function () {
  'use strict';

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Keep policy, standards, field notes and games hub reachable from shared pages.
  var footerLinks = document.querySelector('.footer-links');
  if (footerLinks) {
    if (!footerLinks.querySelector('a[href$="games.html"]')) {
      var gamesLink = document.createElement('a');
      gamesLink.href = '/games.html';
      gamesLink.textContent = 'Games';
      footerLinks.appendChild(gamesLink);
    }
    if (!footerLinks.querySelector('a[href$="field-notes.html"]')) {
      var notesLink = document.createElement('a');
      notesLink.href = '/field-notes.html';
      notesLink.textContent = 'Field Notes';
      footerLinks.appendChild(notesLink);
    }
    if (!footerLinks.querySelector('a[href$="standards.html"]')) {
      var standardsLink = document.createElement('a');
      standardsLink.href = '/standards.html';
      standardsLink.textContent = 'Standards';
      footerLinks.appendChild(standardsLink);
    }
    if (!footerLinks.querySelector('a[href$="privacy.html"]')) {
      var privacyLink = document.createElement('a');
      privacyLink.href = '/privacy.html';
      privacyLink.textContent = 'Privacy';
      footerLinks.appendChild(privacyLink);
    }
  }

  // The Worker belongs in the shared product footer without removing other work.
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

  // Homepage: a compact bridge from the service/build story into recurring products.
  // It sits inside the existing Products section, so no new page hierarchy or redesign.
  var homeProductGrid = document.querySelector('#products .prod-grid');
  if (homeProductGrid && !document.getElementById('games-bridge')) {
    var gamesBridge = document.createElement('div');
    gamesBridge.id = 'games-bridge';
    gamesBridge.className = 'fade-up';
    gamesBridge.setAttribute('aria-label', 'Games and live products built by Dubel Team');
    gamesBridge.style.cssText = 'margin:0 0 30px;padding:22px 24px;border:2px solid var(--ink);display:grid;grid-template-columns:minmax(0,1fr) auto;gap:22px;align-items:center;background:var(--cream-warm)';
    gamesBridge.innerHTML =
      '<div>' +
        '<div style="font-family:var(--body);font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--red);margin-bottom:8px">Games & live products</div>' +
        '<div style="font-family:var(--display);font-size:clamp(27px,3.5vw,46px);line-height:.95;text-transform:uppercase;color:var(--ink);margin-bottom:9px">WE BUILD OUR OWN, <span style="font-family:var(--italic);font-style:italic;font-weight:500;text-transform:none;color:var(--red)">too.</span></div>' +
        '<p style="margin:0;max-width:760px;font-family:var(--body);font-size:14px;line-height:1.55;color:var(--ink-soft)">The Worker, Dubid and Offsides are recurring football products we build and operate ourselves — alongside tools, archives and experiments. New rounds, fresh data, expanding history and ongoing maintenance give people a reason to return.</p>' +
        '<div style="display:flex;gap:14px;flex-wrap:wrap;margin-top:14px;font-family:var(--body);font-size:12px;font-weight:700">' +
          '<a href="https://theworker.dubelteam.com/" target="_blank" rel="noopener" style="color:var(--ink)">The Worker ↗</a>' +
          '<a href="https://dubid.dubelteam.com/" target="_blank" rel="noopener" style="color:var(--ink)">Dubid ↗</a>' +
          '<a href="https://offsides.dubelteam.com/" target="_blank" rel="noopener" style="color:var(--ink)">Offsides ↗</a>' +
        '</div>' +
      '</div>' +
      '<a href="games.html" class="btn btn-primary" style="white-space:nowrap">Explore our games →</a>';
    homeProductGrid.parentNode.insertBefore(gamesBridge, homeProductGrid);

    if (window.matchMedia && window.matchMedia('(max-width:700px)').matches) {
      gamesBridge.style.gridTemplateColumns = '1fr';
      gamesBridge.querySelector('.btn').style.justifySelf = 'start';
    }
  }

  // Homepage: keep The Worker visible in the existing sixth card slot.
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
  var path = window.location.pathname;
  var isProductContext = path === '/' || /\/(index|platforms|games)\.html$/.test(path);
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

  // Sticky nav.
  var nav = document.getElementById('nav');
  if (nav) {
    var onScroll = function () {
      if (window.scrollY > 24) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Mobile menu.
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

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Fade-up on scroll with fallbacks.
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

  // Animated counters.
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

  // Who's the team modal.
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
