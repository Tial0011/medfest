/**
 * js/utils.js — tiny, dependency-free helpers shared by components/main.js.
 * Loaded before components/*.js and js/main.js (see script order in HTML).
 */

const Utils = {
  qs(selector, scope = document) {
    return scope.querySelector(selector);
  },

  qsa(selector, scope = document) {
    return Array.from(scope.querySelectorAll(selector));
  },

  /** True if the visitor's OS/browser requests reduced motion. */
  prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  },

  /** Prevents body scroll while a modal/menu overlay is open. */
  lockScroll() {
    document.body.style.overflow = "hidden";
  },

  unlockScroll() {
    document.body.style.overflow = "";
  },

  /**
   * Resolves a link defined in data/site.js (relative to the site root)
   * against the current page's depth, so the same data works from both
   * /index.html and /pages/*.html.
   * @param {string} root - "" at the site root, "../" from /pages/*.html
   * @param {string} href
   */
  resolveHref(root, href) {
    if (!href || href.startsWith("#") || /^https?:\/\//.test(href)) {
      return href;
    }
    return root + href;
  },

  /** Simple focus trap for the open mobile menu. Returns a cleanup fn. */
  trapFocus(container) {
    const focusable = Utils.qsa(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      container
    );
    if (!focusable.length) return () => {};

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    function handleKeydown(e) {
      if (e.key !== "Tab") return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    container.addEventListener("keydown", handleKeydown);
    first.focus();

    return () => container.removeEventListener("keydown", handleKeydown);
  },
};

window.Utils = Utils;
