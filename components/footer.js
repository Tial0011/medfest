/**
 * components/footer.js
 * ---------------------------------------------------------------------
 * Renders the site footer into a mount point from centralized data.
 * Usage: <div id="footer-root" data-root=""></div>
 * ------------------------------------------------------------------- */

function renderFooter(mount) {
  if (!mount) return;
  const root = mount.dataset.root ?? "";
  const { name, footer } = window.SITE;

  const columns = footer.columns
    .map((col) => {
      const items = col.links
        .map((link) => {
          const href = Utils.resolveHref(root, link.href);
          const label = link.note ? `${link.label} — ${link.note}` : link.label;
          return `<li><a href="${href}">${label}</a></li>`;
        })
        .join("");
      return `<div class="footer__col"><h3>${col.title}</h3><ul>${items}</ul></div>`;
    })
    .join("");

  mount.innerHTML = `
    <footer class="footer">
      <div class="container">
        <div class="footer__top">
          <div>
            <a class="footer__logo" href="${Utils.resolveHref(root, "index.html")}">
              ${name}<span>V</span>
            </a>
            <p class="footer__tagline">${footer.tagline}</p>
          </div>
          <nav class="footer__nav" aria-label="Footer">${columns}</nav>
        </div>
        <div class="footer__bottom">
          <span>${footer.copyright}</span>
          <span>Ondo City · December 2026</span>
        </div>
      </div>
    </footer>
  `;
}
