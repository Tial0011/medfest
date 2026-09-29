/* Light scroll-reveal for PHOTOS only (text stays still). Vanilla JS, cheap on phones. */
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) return;
  document.documentElement.classList.add("js-motion");

  function start() {
    var sel = "main figure, main article, main .gallery img, main .journey__edition";
    var skip = ".hero, .hero__media, [data-hero-slides], .xp-hero__pics, .navbar, .somewhere-tonight__track";
    var els = [];
    // Elements already tagged in the HTML must be observed too (this was the "invisible cards" bug)
    document.querySelectorAll("[data-reveal]").forEach(function (el) { els.push(el); });
    document.querySelectorAll(sel).forEach(function (el) {
      if (el.closest(skip) || el.hasAttribute("data-reveal") || (el.parentElement && el.parentElement.closest("[data-reveal]"))) return;
      if (!el.querySelector("img") && el.tagName !== "IMG") return; // only things with pictures
      el.setAttribute("data-reveal", "");
      els.push(el);
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -5% 0px" });
    els.forEach(function (el) { io.observe(el); });

    // Gentle photo drift on scroll: desktop with a mouse only (skipped on phones/tablets)
    var fine = window.matchMedia("(hover: hover) and (min-width: 900px)").matches;
    var photos = fine ? document.querySelectorAll(".xp-photo img") : [];
    if (photos.length) {
      var ticking = false;
      window.addEventListener("scroll", function () {
        if (ticking) return; ticking = true;
        requestAnimationFrame(function () {
          var vh = window.innerHeight;
          photos.forEach(function (img) {
            var r = img.parentElement.getBoundingClientRect();
            if (r.bottom < 0 || r.top > vh) return;
            img.style.objectPosition = "50% " + (50 + ((r.top + r.height / 2 - vh / 2) / vh) * 12) + "%";
          });
          ticking = false;
        });
      }, { passive: true });
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
