/** Mount shared components and wire the mobile navigation disclosure. */
document.addEventListener("DOMContentLoaded", () => {
  renderNavbar(Utils.qs("#navbar-root"));
  renderMobileMenu(Utils.qs("#mobile-menu-root"));
  if (typeof renderFooter === "function")
    renderFooter(Utils.qs("#footer-root"));
  initMobileMenu();
  initNavbarScroll();
  initHeroSlider();
  initJourneyScroll();
});

function initJourneyScroll() {
  const track = document.querySelector(".journey__track");
  const controls = document.querySelector(".journey__scroll");
  if (!track || !controls) return;
  const range = controls.querySelector("input");
  const buttons = [...controls.querySelectorAll("button")];
  const maxScroll = () => Math.max(0, track.scrollWidth - track.clientWidth);
  const sync = () => {
    const max = maxScroll();
    controls.hidden = max <= 1;
    range.value = max ? (track.scrollLeft / max) * 100 : 0;
    controls.style.setProperty("--scroll-thumb", `${Math.max(12, track.clientWidth / track.scrollWidth * 100)}%`);
    buttons[0].disabled = track.scrollLeft <= 1;
    buttons[1].disabled = track.scrollLeft >= max - 1;
  };
  range.addEventListener("input", () => {
    track.classList.add("journey__track--scrubbing");
    track.scrollLeft = (Number(range.value) / 100) * maxScroll();
  });
  const endScrub = () => track.classList.remove("journey__track--scrubbing");
  range.addEventListener("change", endScrub);
  range.addEventListener("blur", endScrub);
  buttons.forEach(button => button.addEventListener("click", () => {
    const cards = track.querySelectorAll(".journey__item");
    const step = cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : track.clientWidth;
    track.scrollBy({ left: Number(button.dataset.journeyDirection) * step,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }));
  track.addEventListener("scroll", sync, { passive: true });
  new ResizeObserver(sync).observe(track);
  sync();
}

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
