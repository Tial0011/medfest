/** Mount shared components and wire the mobile navigation disclosure. */
document.addEventListener("DOMContentLoaded", () => {
  renderNavbar(Utils.qs("#navbar-root"));
  renderMobileMenu(Utils.qs("#mobile-menu-root"));
  if (typeof renderFooter === "function")
    renderFooter(Utils.qs("#footer-root"));
  initMobileMenu();
  initNavbarScroll();
  initHeroVideo();
});

function initHeroVideo() {
  const video = Utils.qs("[data-hero-video]");
  const source = Utils.qs("[data-hero-video] source");
  const sound = Utils.qs("[data-hero-sound]");
  const activate = Utils.qs("[data-hero-activate]");
  const soundLabel = Utils.qs("[data-hero-sound-label]");
  if (!video || !source || !sound || !activate) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const connection = navigator.connection;
  const slowConnection =
    connection?.saveData ||
    ["slow-2g", "2g", "3g"].includes(connection?.effectiveType);
  if (slowConnection) return;

  source.src = source.dataset.src;
  video.load();

  sound.hidden = false;
  const setSoundState = (enabled) => {
    video.muted = !enabled;
    sound.setAttribute("aria-pressed", String(enabled));
    sound.setAttribute(
      "aria-label",
      enabled ? "Turn sound off" : "Turn sound on",
    );
    soundLabel.textContent = enabled ? "Sound on" : "Sound off";
    sound.classList.toggle("is-muted", !enabled);
  };
  const enableSound = () => {
    setSoundState(true);
    activate.hidden = true;
    video.play().catch(() => {});
  };

  setSoundState(true);
  video.play().catch(() => {
    setSoundState(false);
    activate.hidden = false;
    video.play().catch(() => {});
  });
  sound.addEventListener("click", () => {
    if (video.muted) enableSound();
    else setSoundState(false);
  });
  activate.addEventListener("click", enableSound);
  video.addEventListener("error", () => {
    sound.hidden = true;
    activate.hidden = true;
  });
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
