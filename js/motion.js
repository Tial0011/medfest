/* Scroll-reveal + light parallax for the whole site (vanilla JS). */
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) return;
  document.documentElement.classList.add("js-motion");

  function tag() {
    var sel = [
      "main h2","main .section-label","main section p","main figure","main article",
      "main .btn","main .gallery img","main .journey__edition","main .medfest-number",
      "main li"
    ].join(",");
    var seen = new Set();
    document.querySelectorAll(sel).forEach(function (el) {
      if (el.closest(".hero, .hero__media, [data-hero-slides], .xp-hero__pics, .xp-marquee, .navbar, .somewhere-tonight__track")) return;
      if (el.hasAttribute("data-reveal")) { seen.add(el); return; }
      if (el.closest("[data-reveal]")) return; // parent already animates
      el.setAttribute("data-reveal", "");
      seen.add(el);
    });
    // stagger siblings
    var groups = new Map();
    seen.forEach(function (el) {
      var p = el.parentElement;
      if (!groups.has(p)) groups.set(p, []);
      groups.get(p).push(el);
    });
    groups.forEach(function (list) {
      list.forEach(function (el, i) { el.style.setProperty("--reveal-delay", Math.min(i, 6) * 90 + "ms"); });
    });
    return seen;
  }

  function start() {
    var els = tag();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    els.forEach(function (el) { io.observe(el); });

    // light parallax on experience photos
    var photos = document.querySelectorAll(".xp-photo img");
    if (photos.length) {
      var ticking = false;
      window.addEventListener("scroll", function () {
        if (ticking) return; ticking = true;
        requestAnimationFrame(function () {
          var vh = window.innerHeight;
          photos.forEach(function (img) {
            var r = img.parentElement.getBoundingClientRect();
            if (r.bottom < 0 || r.top > vh) return;
            var p = (r.top + r.height / 2 - vh / 2) / vh;
            img.style.objectPosition = "50% " + (50 + p * 18) + "%";
          });
          ticking = false;
        });
      }, { passive: true });
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
