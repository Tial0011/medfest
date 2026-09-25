/** Mount shared components and wire the mobile navigation disclosure. */
document.addEventListener("DOMContentLoaded", () => {
  renderNavbar(Utils.qs("#navbar-root"));
  renderMobileMenu(Utils.qs("#mobile-menu-root"));
  if (typeof renderFooter === "function")
    renderFooter(Utils.qs("#footer-root"));
  initMobileMenu();
  initNavbarScroll();
  initHeroSlider();
});

function initHeroSlider() {
  const slider = Utils.qs("[data-hero-slides]");
  if (!slider) return;

  const slides = [...slider.querySelectorAll(".hero__slide")];
  let currentIndex = 0;
  let timer;

  function loadSlide(slide) {
    if (slide.dataset.src) {
      slide.src = slide.dataset.src;
      delete slide.dataset.src;
    }
  }

  function showSlide(index) {
    currentIndex = (index + slides.length) % slides.length;
    loadSlide(slides[currentIndex]);
    loadSlide(slides[(currentIndex + 1) % slides.length]);
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === currentIndex);
    });
    restartTimer();
  }

  function restartTimer() {
    clearInterval(timer);
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      timer = setInterval(() => showSlide(currentIndex + 1), 5000);
  }

  slider.addEventListener("mouseenter", () => clearInterval(timer));
  slider.addEventListener("mouseleave", restartTimer);
  slides.forEach(loadSlide);
  showSlide(0);
}

function initMobileMenu() {
  const toggle = Utils.qs("[data-menu-toggle]");
  const menu = Utils.qs("[data-mobile-menu]");
  if (!toggle || !menu) return;

  function setOpen(open, restoreFocus = false) {
    menu.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (restoreFocus) toggle.focus();
  }

  toggle.addEventListener("click", () => setOpen(menu.hidden));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !menu.hidden) setOpen(false, true);
  });
  document.addEventListener("click", (event) => {
    if (
      !menu.hidden &&
      !menu.contains(event.target) &&
      !toggle.contains(event.target)
    )
      setOpen(false);
  });
  document.addEventListener("focusin", (event) => {
    if (
      !menu.hidden &&
      !menu.contains(event.target) &&
      !toggle.contains(event.target)
    )
      setOpen(false);
  });
  menu.addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false);
  });
  window
    .matchMedia("(min-width: 1080px)")
    .addEventListener("change", (event) => {
      if (event.matches) {
        const focusWasInMenu =
          menu.contains(document.activeElement) ||
          document.activeElement === toggle;
        setOpen(false);
        if (focusWasInMenu) Utils.qs(".navbar__logo").focus();
      }
    });
}

/** Compact the fixed header down-page, and restore it when scrolling upward. */
function initNavbarScroll() {
  let previousY = Math.max(0, window.scrollY);
  let scheduled = false;
  const update = () => {
    const currentY = Math.max(0, window.scrollY);
    if (currentY <= 24) document.body.classList.remove("nav-compact");
    else if (currentY > 80 && currentY - previousY > 4)
      document.body.classList.add("nav-compact");
    else if (previousY - currentY > 4)
      document.body.classList.remove("nav-compact");
    if (Math.abs(currentY - previousY) > 4 || currentY <= 24)
      previousY = currentY;
    scheduled = false;
  };
  document.body.classList.toggle("nav-compact", previousY > 80);
  window.addEventListener(
    "scroll",
    () => {
      if (!scheduled) {
        scheduled = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
}
