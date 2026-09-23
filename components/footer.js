/** Shared footer with brand/social links left and navigation right. */
function renderFooter(mount) {
  if (!mount) return;
  const root = mount.dataset.root ?? "";
  const { nav, footer, ticketsCta } = window.SITE;
  const icons = {
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none"/>',
    whatsapp: '<path d="M20.5 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20l1.2-4.7A8.5 8.5 0 1 1 20.5 11.5Z"/><path d="M8 7.5c0 4.5 3.5 8 8 8l1-2.5-3-1-1 1a8 8 0 0 1-2.5-2.5l1-1-1-3Z"/>',
    email: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
    phone: '<path d="M8 3H4a1 1 0 0 0-1 1c0 9.4 7.6 17 17 17a1 1 0 0 0 1-1v-4l-5-2-2 2a15 15 0 0 1-6-6l2-2Z"/>',
  };
  const icon = name => `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]}</svg>`;
  mount.innerHTML = `
    <footer class="mf-footer" aria-label="MedFest footer">
      <div class="container">
        <div class="mf-footer__grid">
          <div class="mf-footer__brand">
            <a class="mf-footer__logo" href="${Utils.resolveHref(root, 'index.html')}">
              <img src="${Utils.resolveHref(root, 'assets/images/medfest-logo.webp')}" alt="MedFest V — Home" width="176" height="96" loading="lazy" decoding="async">
            </a>
            <p class="mf-footer__tagline">The Fifth Chapter.</p>
            <div class="mf-footer__socials">
              <a class="mf-footer__icon" href="${footer.instagram.href}" aria-label="Instagram: @${footer.instagram.handle}" title="Instagram">${icon('instagram')}</a>
              <a class="mf-footer__icon" href="https://wa.me/2347045567948" aria-label="WhatsApp +234 704 556 7948" title="WhatsApp +234 704 556 7948">${icon('whatsapp')}</a>
              <a class="mf-footer__icon" href="mailto:${footer.email}" aria-label="Email partnerships: ${footer.email}" title="Email partnerships">${icon('email')}</a>
              <div class="mf-footer__phones">
                <a class="mf-footer__phone" href="tel:+2347047157003">${icon('phone')}<span>07047157003</span></a>
                <a class="mf-footer__phone" href="tel:+2347045567948">${icon('phone')}<span>07045567948</span></a>
              </div>
            </div>
          </div>
          <nav class="mf-footer__nav" aria-label="Footer navigation">
            <ul>${nav.map(item => `<li><a href="${Utils.resolveHref(root, item.href)}">${item.label}</a></li>`).join('')}
              <li><a href="${Utils.resolveHref(root, ticketsCta.href)}">${ticketsCta.label}</a></li>
            </ul>
          </nav>
        </div>
        <div class="mf-footer__bottom"><small>© ${new Date().getFullYear()} MedFest. All rights reserved.</small><button class="mf-footer__top" type="button">Back to top <span aria-hidden="true">↑</span></button></div>
      </div>
    </footer>`;
  mount.querySelector(".mf-footer__top").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: Utils.prefersReducedMotion() ? "instant" : "smooth" });
    document.querySelector(".navbar__logo")?.focus({ preventScroll: true });
  });
}




