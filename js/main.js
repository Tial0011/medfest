/** Mount shared components and wire the mobile navigation disclosure. */
document.addEventListener("DOMContentLoaded", () => {
  renderNavbar(Utils.qs("#navbar-root"));
  renderMobileMenu(Utils.qs("#mobile-menu-root"));
  if (typeof renderFooter === "function")
    renderFooter(Utils.qs("#footer-root"));
  initMobileMenu();
  initNavbarScroll();
  initHeroSlider();
  initBrandCarousel();
  initJourneyScroll();
});

function initBrandCarousel() {
  const carousel = Utils.qs("[data-brand-carousel]");
  if (!carousel) return;

  const slides = [...carousel.querySelectorAll("[data-brand-slide]")];
  const currentCount = carousel.querySelector("[data-brand-slide-current]");
  const totalCount = carousel.querySelector("[data-brand-slide-total]");
  const previous = carousel.querySelector("[data-brand-previous]");
  const next = carousel.querySelector("[data-brand-next]");
  if (slides.length < 2 || !currentCount || !totalCount || !previous || !next)
    return;

  let activeIndex = 0;
  let timer;
  totalCount.textContent = String(slides.length).padStart(2, "0");

  function showSlide(index) {
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.hidden = slideIndex !== activeIndex;
    });
    currentCount.textContent = String(activeIndex + 1).padStart(2, "0");
    restartTimer();
  }

  function restartTimer() {
    clearInterval(timer);
    if (
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      !carousel.matches(":hover") &&
      !carousel.contains(document.activeElement) &&
      !document.hidden
    ) {
      timer = setInterval(() => showSlide(activeIndex + 1), 5000);
    }
  }

  previous.addEventListener("click", () => showSlide(activeIndex - 1));
  next.addEventListener("click", () => showSlide(activeIndex + 1));
  carousel.addEventListener("mouseenter", () => clearInterval(timer));
  carousel.addEventListener("mouseleave", restartTimer);
  carousel.addEventListener("focusin", () => clearInterval(timer));
  carousel.addEventListener("focusout", (event) => {
    if (!carousel.contains(event.relatedTarget)) restartTimer();
  });
  document.addEventListener("visibilitychange", restartTimer);
  showSlide(0);
}

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
    controls.style.setProperty(
      "--scroll-thumb",
      `${Math.max(12, (track.clientWidth / track.scrollWidth) * 100)}%`,
    );
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
  buttons.forEach((button) =>
    button.addEventListener("click", () => {
      const cards = track.querySelectorAll(".journey__item");
      const step =
        cards.length > 1
          ? cards[1].offsetLeft - cards[0].offsetLeft
          : track.clientWidth;
      track.scrollBy({
        left: Number(button.dataset.journeyDirection) * step,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
    }),
  );
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

  // Slide counter + clickable progress ticks
  const ticksWrap = Utils.qs("[data-hero-ticks]");
  const currentLabel = Utils.qs("[data-hero-current]");
  const totalLabel = Utils.qs("[data-hero-total]");
  const pad = (n) => String(n).padStart(2, "0");
  if (totalLabel) totalLabel.textContent = pad(slides.length);
  const ticks = ticksWrap
    ? slides.map((_, i) => {
        const tick = document.createElement("button");
        tick.type = "button";
        tick.className = "hero__tick";
        tick.setAttribute("aria-label", "Show photo " + (i + 1));
        tick.addEventListener("click", () => showSlide(i));
        ticksWrap.appendChild(tick);
        return tick;
      })
    : [];

  function loadSlide(slide) {
    if (slide.dataset.srcset) {
      slide.srcset = slide.dataset.srcset;
      delete slide.dataset.srcset;
    }
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
    ticks.forEach((tick, i) =>
      tick.classList.toggle("is-active", i === currentIndex),
    );
    if (currentLabel) currentLabel.textContent = pad(currentIndex + 1);
    restartTimer();
  }

  function restartTimer() {
    clearInterval(timer);
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      timer = setInterval(() => showSlide(currentIndex + 1), 5000);
  }

  slider.addEventListener("mouseenter", () => clearInterval(timer));
  slider.addEventListener("mouseleave", restartTimer);
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
