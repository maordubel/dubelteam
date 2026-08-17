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
            // Reveal anything already in or above the viewport
            if (r.top < window.innerHeight * 1.2) el.classList.add('in');
          });
        }, 300);
      });
      // Absolute fallback — everything visible within 3s no matter what.
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
        var eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
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
