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
