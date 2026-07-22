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

  // Quote form → emails the request to the business via FormSubmit.
  // Submits over AJAX so the visitor stays on the page and sees the inline
  // confirmation. Falls back to a normal POST (form "action") if JS is off.
  var form = document.getElementById('quote-form');
  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var btn = form.querySelector('button[type=submit]');
      var original = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Sending…';

      var payload = {};
      new FormData(form).forEach(function (value, key) { payload[key] = value; });

      fetch('https://formsubmit.co/ajax/bhurtel.hari62@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Bad response');
          return res.json();
        })
        .then(function () {
          btn.textContent = '✓ Request received — we’ll be in touch!';
          btn.style.background = '#089890';
          form.reset();
        })
        .catch(function () {
          btn.disabled = false;
          btn.textContent = original;
          var note = form.querySelector('.form-note');
          if (note) {
            note.textContent = 'Sorry — we couldn’t send that. Please email bhurtel.hari62@gmail.com directly.';
            note.style.color = '#c0392b';
          }
        });
    });
  }
})();
