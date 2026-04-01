/**
 * Résumé page: cursor + nav shrink only. Background = bg-simple.js
 */
(function () {
  var cur = document.getElementById('cursor');
  var narrowMQ = window.matchMedia && window.matchMedia('(max-width: 768px)');
  function cursorHidden() {
    return !cur || (window.getComputedStyle && window.getComputedStyle(cur).display === 'none');
  }
  function resetCursorClasses() {
    if (!cur) return;
    cur.classList.remove('is-nav', 'is-hovering');
  }
  if (cur) {
    cur.style.transform = 'translate(-20px,-20px)';
    document.addEventListener('mousemove', function (e) {
      if (cursorHidden()) return;
      cur.style.transform = 'translate(' + (e.clientX - 5) + 'px,' + (e.clientY - 5) + 'px)';
    });
    document.querySelectorAll('nav a').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        if (cursorHidden()) return;
        cur.classList.add('is-nav');
      });
      el.addEventListener('mouseleave', function () {
        cur.classList.remove('is-nav');
      });
    });
    document.querySelectorAll('a:not(nav a)').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        if (cursorHidden()) return;
        cur.classList.add('is-hovering');
      });
      el.addEventListener('mouseleave', function () {
        cur.classList.remove('is-hovering');
      });
    });
    if (narrowMQ) {
      var onNarrowChange = function () {
        resetCursorClasses();
      };
      if (narrowMQ.addEventListener) narrowMQ.addEventListener('change', onNarrowChange);
      else if (narrowMQ.addListener) narrowMQ.addListener(onNarrowChange);
    }
  }

  var nav = document.querySelector('nav');
  function navIsMobile() {
    return window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
  }
  if (nav) {
    window.addEventListener(
      'scroll',
      function () {
        if (navIsMobile()) {
          nav.style.background = window.scrollY > 60 ? 'rgba(7,7,15,0.96)' : '';
          nav.style.backdropFilter = '';
          nav.style.webkitBackdropFilter = '';
          nav.style.padding = '';
          return;
        }
        if (window.scrollY > 60) {
          nav.style.background = 'rgba(7,7,15,0.96)';
          nav.style.backdropFilter = 'blur(20px)';
          nav.style.padding = '14px 48px';
        } else {
          nav.style.background = '';
          nav.style.backdropFilter = '';
          nav.style.padding = '';
        }
      },
      { passive: true }
    );
  }
})();
