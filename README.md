# MedFest V — Website Foundation (Phase 1)

This is the **Phase 1 foundation** for the MedFest V website: project structure, design
system, navigation, and the homepage hero. It is intentionally not a full site yet —
see [What's _not_ built yet](#whats-not-built-yet).

Built with **plain HTML5, CSS3, and vanilla JavaScript only** (no React/Vue/Next/build
tools), but organized the way a component-based framework project would be, so it stays
easy to extend: reusable components, a centralized data file, and clearly separated CSS.

---

## Quick start

No build step, no dependencies. Just serve the folder statically:

```bash
# any static server works, e.g.:
npx serve .
# or
python3 -m http.server 8080
```

Then open `http://localhost:8080` (or wherever your server points) and go to
`index.html`. Opening `index.html` directly via `file://` also works, since everything
is plain relative paths — no bundler required.

---

## Project structure

```
medfest/
├── index.html              → Homepage (hero + placeholder section)
├── pages/                  → One HTML file per site section
│   ├── about.html
│   ├── experience.html
│   ├── partners.html
│   ├── get-involved.html
│   ├── faq.html
│   └── contact.html
├── components/              → Reusable UI "components" (see below)
│   ├── navbar.js
│   └── footer.js
├── data/
│   └── site.js              → Centralized content: nav links, footer links, hero copy
├── css/
│   ├── reset.css             → Browser reset only — no design decisions
│   ├── variables.css         → Design tokens (colors, type, spacing, radius, motion)
│   ├── global.css            → Base typography, layout primitives, buttons, utilities
│   ├── components.css        → Navbar, mobile menu, hero, footer styles
│   ├── pages.css              → Page-specific styles (grows as pages get built out)
│   └── responsive.css         → Breakpoint overrides only
├── js/
│   ├── utils.js                → Shared helpers (DOM query shortcuts, focus trap, etc.)
│   └── main.js                 → Mounts components + wires up interactions on every page
├── assets/
│   ├── images/, videos/, icons/, fonts/  → Drop real media here as it's produced
├── seo/
│   ├── robots.txt
│   └── sitemap.xml
└── README.md
```

## How the "component" system works

There's no framework, so a "component" here is just:

1. A **data shape** in `data/site.js` (e.g. the list of nav links).
2. A **render function** in `components/*.js` that turns that data into an HTML string
   and injects it into a mount point (e.g. `renderNavbar()` fills `#navbar-root`).
3. A **mount point** `<div>` in each page's HTML, with `data-root` and `data-active`
   attributes so the same component works correctly from both `index.html` and the
   `pages/*.html` files (which are one folder deeper, hence `data-root="../"`).

`js/main.js` runs on every page, calls each component's render function, then wires up
shared interactive behavior (scroll-aware navbar, accessible mobile menu).

### Adding a new component

1. Create `components/my-component.js` with a `renderMyComponent(mount) {...}` function
   that reads whatever it needs from `window.SITE` (add new fields to `data/site.js` if
   needed) and sets `mount.innerHTML`.
2. Add its styles to `css/components.css`.
3. Add a mount point (`<div id="my-component-root" data-root="..."></div>`) to the pages
   that need it, and a `<script src=".../components/my-component.js"></script>` tag.
4. Call `renderMyComponent(Utils.qs("#my-component-root"))` inside `mountComponents()`
   in `js/main.js`.

## Navigation

- **Desktop**: logo left, links center, "Get Tickets" + hamburger (mobile only) right.
  Transparent over the hero; gains a blurred glass background once the page scrolls
  (`.navbar.is-scrolled`, toggled in `js/main.js`).
- **Mobile**: hamburger opens a full-screen glass overlay menu (`components/navbar.js`
  → `renderMobileMenu`). Handles: open/close animation, body scroll lock, focus trap,
  `Esc` to close, and returns focus to the toggle button on close — see
  `initMobileMenu()` in `js/main.js`.

## Design system

All brand-derived tokens live in `css/variables.css`:

- **Colors** come directly from the MedFest V brand document: magenta `#fb0376`,
  purple `#662d91`, black `#000000`, cream `#fff4d2`. These are mapped to semantic
  roles (`--color-primary`, `--color-background`, etc.) so future pages theme
  consistently.
- **Type**: titles use the supplied Neulis SemiBold font, while subheadings use
  Poppins 600 and body content uses Poppins 500. The font is loaded from
  `assets/fonts/Neulis Font Family/`.
- Glassmorphism is applied selectively via the `.glass` utility class (navbar, mobile
  menu, hero kicker pill) — not globally, per the brand direction.

## Accessibility & performance notes

- Skip link, visible focus rings, semantic landmarks (`nav`, `main`, `footer`).
- Mobile menu is a proper `role="dialog"` with a focus trap and `Esc`-to-close.
- All animation respects `prefers-reduced-motion`.
- No 3D/WebGL or hero video — the hero uses a lazy-loaded image slider, CSS gradients,
  blur, and one inline decorative SVG, which is cheaper and more reliable across devices.

## SEO

`index.html` and every page in `pages/` ship semantic headings, a descriptive
`<title>`/meta description, Open Graph tags, and a canonical URL. `seo/robots.txt` and
`seo/sitemap.xml` use a placeholder domain (`medfestng.com`) — update it once the real
domain is confirmed, and note that both files should be **deployed at the site root**
(`/robots.txt`, `/sitemap.xml`) even though they're authored under `seo/` here.

## What's _not_ built yet

By design, this phase stops at the hero. Still to come in later phases:

- Full homepage sections: What Is MedFest?, MedFest V, The Experience, Somewhere
  Tonight, MedFest By The Numbers, The Journey, For Brands, Gallery, Final CTA.
- Fully designed About / Experience / Partners / Get Involved / FAQ / Contact pages
  (currently simple placeholders).
- Real assets (photos, video, icons) in `assets/`.
- Ticketing, forms, and any backend/CMS integration.

## Continuing development

- Keep new data (copy, links, stats) in `data/site.js` rather than hard-coding it in
  HTML, so it stays easy to update in one place.
- Keep one concern per CSS file (see the comment at the top of each file).
- Every new page should copy the `<head>` block and the three mount points
  (`#navbar-root`, `#mobile-menu-root`, `#footer-root`) plus the five `<script>` tags
  from an existing page in `pages/`, then set the correct `data-active` value.
