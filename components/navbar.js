/**
 * components/navbar.js
 * ---------------------------------------------------------------------
 * Renders the primary navigation (desktop bar + mobile overlay menu)
 * into a mount point from centralized data (data/site.js).
 *
 * Usage (see any page's HTML):
 *   <div id="navbar-root" data-root="" data-active="home"></div>
 *   <div id="mobile-menu-root" data-root="" data-active="home"></div>
 *
 * `data-root` is "" on index.html and "../" on pages/*.html â€” it lets one
 * data file describe links that work correctly from any folder depth.
 * ------------------------------------------------------------------- */

function renderNavbar(mount) {
  if (!mount) return;
  const root = mount.dataset.root ?? "";
  const active = mount.dataset.active ?? "";
  const { nav, ticketsCta, name } = window.SITE;

  const links = nav
    .map((item) => {
      const isActive = item.match === active;
      return `<a class="navbar__link" href="${Utils.resolveHref(root, item.href)}"
        ${isActive ? 'aria-current="page"' : ""}>${item.label}</a>`;
    })
    .join("");

  mount.innerHTML = `
    <nav class="navbar" data-navbar aria-label="Primary">
      <div class="container navbar__inner">
        <a class="navbar__logo" href="${Utils.resolveHref(root, "index.html")}">
          <img class="navbar__brand-image" src="${Utils.resolveHref(root, "assets/images/medfest-logo.svg")}" alt="${name} V - Home" width="132" height="72" />
        </a>
        <div class="navbar__links">${links}</div>
        <div class="navbar__actions">
          <a class="btn btn-primary navbar__tickets" href="${Utils.resolveHref(root, ticketsCta.href)}">
            ${ticketsCta.label}
          </a>
          <button
            type="button"
            class="navbar__toggle"
            data-menu-toggle
            aria-expanded="false"
            aria-controls="mobile-menu"
            aria-label="Open menu"
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </nav>
  `;
}

function renderMobileMenu(mount) {
  if (!mount) return;
  const root = mount.dataset.root ?? "";
  const active = mount.dataset.active ?? "";
  const { nav, ticketsCta } = window.SITE;

  const links = nav
    .map((item) => {
      const isActive = item.match === active;
      return `<a class="mobile-menu__link" href="${Utils.resolveHref(root, item.href)}"
        ${isActive ? 'aria-current="page"' : ""}>${item.label}</a>`;
    })
    .join("");

  mount.innerHTML = `
    <div
      class="mobile-menu"
      id="mobile-menu"
      data-mobile-menu
      hidden

      aria-label="Mobile navigation"
    >
      <div class="mobile-menu__links">
        ${links}
        <a class="btn btn-primary mobile-menu__cta" href="${Utils.resolveHref(root, ticketsCta.href)}">
          ${ticketsCta.label}
        </a>
      </div>
    </div>
  `;
}


