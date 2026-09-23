/**
 * data/site.js
 * ---------------------------------------------------------------------
 * Centralized, framework-free "data layer" for the MedFest V site.
 * Components (navbar.js, footer.js) read from this file instead of
 * hard-coding links, so the whole site's navigation/content can be
 * updated from one place as future phases add real pages and copy.
 *
 * Do NOT invent facts here. Anything not confirmed by the brief uses
 * "Coming soon" / "To be announced".
 * ------------------------------------------------------------------- */

const SITE = {
  name: "MEDFEST",
  edition: "MEDFEST V",
  tagline: "The Fifth Chapter",

  // Root-relative paths resolve correctly from both /index.html and /pages/*.html
  // via the `root` helper each page passes to the component (see main.js).
  nav: [
    { label: "Home", href: "index.html", match: "home" },
    { label: "About", href: "pages/about.html", match: "about" },
    { label: "Experience", href: "pages/experience.html", match: "experience" },
    { label: "Partners", href: "pages/partners.html", match: "partners" },
    { label: "Get Involved", href: "pages/get-involved.html", match: "get-involved" },
    { label: "FAQ", href: "pages/faq.html", match: "faq" },
  ],

  ticketsCta: {
    label: "Get Tickets",
    href: "pages/contact.html", // placeholder destination until ticketing exists
  },

  footer: {
    tagline: "A festival of music, food, culture, business, creativity and unforgettable experiences.",
    columns: [
      {
        title: "Explore",
        links: [
          { label: "About", href: "pages/about.html" },
          { label: "Experience", href: "pages/experience.html" },
          { label: "Partners", href: "pages/partners.html" },
        ],
      },
      {
        title: "Get Involved",
        links: [
          { label: "Get Involved", href: "pages/get-involved.html" },
          { label: "FAQ", href: "pages/faq.html" },
          { label: "Contact", href: "pages/contact.html" },
        ],
      },
      {
        title: "Details",
        links: [
          { label: "Date", href: "#", note: "December 2026" },
          { label: "Location", href: "#", note: "Ondo City" },
          { label: "Tickets", href: "#", note: "Coming soon" },
        ],
      },
    ],
    copyright: `© ${new Date().getFullYear()} MedFest. All rights reserved.`,
  },

  hero: {
    kicker: "MedFest V · The Fifth Chapter",
    title: ["MEDFEST V", "THE FIFTH CHAPTER."],
    meta: "December 2026 · Ondo City",
    description:
      "A festival of music, food, culture, business, creativity and unforgettable experiences.",
    primaryCta: { label: "Get Tickets", href: "pages/contact.html" },
    secondaryCta: { label: "Explore MedFest", href: "#experience-preview" },
    scrollLabel: "Scroll to Experience",
  },
};

// Expose to the rest of the (non-module) vanilla JS codebase.
window.SITE = SITE;
