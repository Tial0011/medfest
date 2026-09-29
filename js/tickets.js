/* "Tickets coming soon" popup. Any element with [data-tickets] opens it. */
(function () {
  var dlg;
  function build() {
    dlg = document.createElement("dialog");
    dlg.className = "tk-dialog";
    dlg.setAttribute("aria-labelledby", "tk-title");
    dlg.innerHTML =
      '<button type="button" class="tk-close" aria-label="Close">&times;</button>' +
      '<p class="tk-kicker">MedFest V &middot; December 2026</p>' +
      '<h2 id="tk-title">Tickets are<br><em>coming soon.</em></h2>' +
      '<p class="tk-text">Ticket prices and the exact date will be announced soon. Follow us or message us on WhatsApp so you don&rsquo;t miss the early-bird announcement.</p>' +
      '<div class="tk-actions">' +
      '<a class="tk-btn tk-btn--main" href="https://www.instagram.com/medfestng_/" target="_blank" rel="noopener">Follow @medfestng_</a>' +
      '<a class="tk-btn tk-btn--alt" href="https://wa.me/2347045567948?text=Hello%20MedFest%2C%20please%20let%20me%20know%20when%20tickets%20are%20available." target="_blank" rel="noopener">Message us on WhatsApp</a>' +
      '</div>';
    document.body.appendChild(dlg);
    dlg.querySelector(".tk-close").addEventListener("click", function () { dlg.close(); });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("[data-tickets]");
    if (!a) return;
    e.preventDefault();
    if (!dlg) build();
    if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
  });
})();
