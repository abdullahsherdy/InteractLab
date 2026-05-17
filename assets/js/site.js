(function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', nav.classList.contains('open'));
    });
  }
})();

// Insert current year into any element with id 'copyright-year'
(function () {
  try {
    var el = document.getElementById('copyright-year');
    if (el) el.textContent = new Date().getFullYear();
  } catch (e) {
    // silent fail
  }
})();

// Highlight current nav link by matching pathname
(function () {
  try {
    var navLinks = document.querySelectorAll('.site-nav a.nav-link');
    if (!navLinks || navLinks.length === 0) return;
    var path = location.pathname.replace(/\/index\.html$/, '/');
    navLinks.forEach(function (a) {
      var href = a.getAttribute('href');
      // Normalize
      var norm = href.replace(/\/index\.html$/, '/');
      if (norm === path || (path === '/' && (href === 'index.html' || href === '/'))) {
        a.classList.add('active');
      }
    });
  } catch (e) {
    // ignore
  }
})();
