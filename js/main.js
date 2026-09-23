/** Mount shared components and wire the mobile navigation disclosure. */
document.addEventListener("DOMContentLoaded", () => {
  renderNavbar(Utils.qs("#navbar-root"));
  renderMobileMenu(Utils.qs("#mobile-menu-root"));
  if (typeof renderFooter === "function") renderFooter(Utils.qs("#footer-root"));
  initMobileMenu();
});

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
    if (!menu.hidden && !menu.contains(event.target) && !toggle.contains(event.target)) setOpen(false);
  });
  document.addEventListener("focusin", (event) => {
    if (!menu.hidden && !menu.contains(event.target) && !toggle.contains(event.target)) setOpen(false);
  });
  menu.addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false);
  });
  window.matchMedia("(min-width: 1080px)").addEventListener("change", (event) => {
    if (event.matches) {
      const focusWasInMenu = menu.contains(document.activeElement) || document.activeElement === toggle;
      setOpen(false);
      if (focusWasInMenu) Utils.qs(".navbar__logo").focus();
    }
  });
}
