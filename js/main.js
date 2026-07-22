/* Capital Solutions — shared 2D interactions */
(function () {
  // Sticky nav shadow
  var nav = document.querySelector('.nav');
  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 10);
  });

  // Mobile menu
  var burger = document.querySelector('.hamburger');
  var links = document.querySelector('.nav-links');
  if (burger) {
    burger.addEventListener('click', function () {
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { links.classList.remove('open'); });
    });
  }

  // Scroll reveal (2D)
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  // Animated counters
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var dur = 1800, start = null;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.firstChild.textContent = Math.round(target * eased).toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  var cio = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        animateCount(e.target);
        cio.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('[data-count]').forEach(function (el) { cio.observe(el); });

  // Sparkles in page heroes (2D decorative)
  var sparkleHost = document.querySelector('.page-hero') || document.querySelector('.hero');
  if (sparkleHost) {
    for (var i = 0; i < 10; i++) {
      var s = document.createElement('div');
      s.className = 'sparkle';
      s.innerHTML =
        '<svg width="16" height="16" viewBox="0 0 16 16" fill="none">' +
        '<path d="M8 0L9.8 6.2L16 8L9.8 9.8L8 16L6.2 9.8L0 8L6.2 6.2Z" fill="#0db9b0"/></svg>';
      s.style.left = Math.random() * 96 + '%';
      s.style.top = Math.random() * 90 + '%';
      s.style.animationDelay = (Math.random() * 3).toFixed(2) + 's';
      s.style.transform = 'scale(' + (0.5 + Math.random()).toFixed(2) + ')';
      sparkleHost.appendChild(s);
    }
  }

  // Quote form (demo handler)
  var form = document.getElementById('quote-form');
  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var btn = form.querySelector('button[type=submit]');
      btn.textContent = '✓ Request received — we’ll be in touch!';
      btn.style.background = '#089890';
      btn.disabled = true;
    });
  }
})();
