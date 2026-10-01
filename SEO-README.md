# MedFest — SEO & AI-visibility guide

Goal: when people search **medfestng, medfestunimed, medfest nigeria, medfest ondo, medfest v**
(or ask an AI assistant about them), they land on *this* MedFest — not the other events and
organisations that share the name.

Everything added in this round is **invisible** (page head, structured data, crawler files).
No section, text, colour or layout on the pages was changed for SEO.

---

## 1. What is already done in the code

| What | Where | Why it helps |
|---|---|---|
| Unique keyword-rich `<title>` + meta description on all 8 pages | `<head>` of each page | Search results snippets; mentions MedFest Nigeria / MedFestNG / Ondo |
| Canonical URL, `hreflang="en-NG"`, `geo.region=NG-ON`, `lang="en-NG"` | `<head>` | Tells Google this is the Nigerian / Ondo MedFest |
| Open Graph + Twitter cards, and a 1200×630 share image | `<head>`, `assets/images/og/medfest-og.jpg` | Good link previews on WhatsApp, X, Instagram DMs, etc. |
| JSON-LD **Organization** with `alternateName`: MedFestNG, MedFest Nigeria, MedFest UNIMED, MedFestUnimed, MedFest Ondo, MedFest V; founder, phone, email, Instagram, Ondo address | every page | The main "this is who we are" signal for Google and AI tools |
| JSON-LD **WebSite** (same alternate names) | home | Lets Google use "MedFest" as the site name |
| JSON-LD **Event** for MedFest V (December 2026, Ondo City, Nigeria) | home | Eligible for event results; tells AI what/when/where |
| JSON-LD **FAQPage** (the exact 10 Q&As already visible on the FAQ page) | `pages/faq.html` | Direct answers for Google and AI assistants |
| JSON-LD AboutPage / ContactPage / CollectionPage + BreadcrumbList | sub-pages | Clear page purpose and hierarchy |
| `robots.txt` (moved to the **site root**, explicitly welcomes search and AI crawlers) | `/robots.txt` | Before, it sat in `/seo/` where crawlers never look |
| `sitemap.xml` (all 8 pages incl. Gallery, lastmod, home image) | `/sitemap.xml` | Faster discovery |
| `llms.txt` and `llms-full.txt` — plain-text facts, edition history, FAQ and a "which MedFest?" disambiguation note | `/llms.txt`, `/llms-full.txt` | Gives AI assistants a clean, authoritative source |
| `<noscript>` link list (only shows with JavaScript off) | top of each page | The nav is built by JavaScript; this lets non-JS crawlers follow your links |
| **Favicon set** (`favicon.ico`, 48/96/144/192 px PNGs, 180 px Apple icon, 512 px icon, `site.webmanifest`) built from your V mark | `/favicon.ico`, `/assets/icons/`, `<head>` | Google shows a favicon next to your result; it needs PNG/ICO in multiples of 48 px, so the old SVG alone was not enough |
| **Share image** `assets/images/og/medfest-og.jpg` (1200×630: logo, MEDFEST V, Ondo City, December 2026) | `<head>` og:image / twitter:image | Link preview on WhatsApp, X, Facebook, LinkedIn |
| Hidden placeholder for Search Console / Bing verification tags | `<head>` (commented out) | Paste your code there in step 3 |

Hero layout and the "Discover our story" colour effect were done in `css/components.css`,
`css/desktop.css` and `css/pages.css`.

---

## 2. Domain

The site address used everywhere (canonical URLs, sitemap, JSON-LD, `robots.txt`, `llms` files) is
**`https://medfest.ng`** (no `www`). Before you deploy:

Also on your host:
- Force **HTTPS**.
- Redirect `www.medfest.ng` to `medfest.ng` with a 301, so Google only sees one version.
- Make sure these open in the browser: `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/llms-full.txt`.

---

## 3. Google Search Console (free, most important)

1. Go to https://search.google.com/search-console and sign in with the Google account that will own the site.
2. **Add property** → choose **Domain** (best) and enter your domain. Add the TXT record it gives you
   at your domain registrar's DNS settings, then click Verify (DNS can take a few minutes to a few hours).
   - Easier alternative: **URL prefix** → paste your site address → choose **HTML tag** → copy the
     `<meta name="google-site-verification" ...>` line into the commented placeholder in the `<head>`
     of `index.html` (un-comment it) → deploy → Verify.
3. **Sitemaps** (left menu) → enter `sitemap.xml` → Submit. Status should say "Success".
4. **URL Inspection** (top bar) → paste each page address → **Request indexing**.
   Do the home page first, then FAQ, About, Experience, Partners, Get Involved, Contact, Gallery.
5. Wait 3–14 days, then check **Pages** (indexed or not) and **Performance** → filter queries containing
   `medfestng`, `medfest ondo`, `medfestunimed`, `medfest nigeria` to see impressions, clicks and position.
6. Check **Settings → Crawl stats** and **Enhancements** (Events / FAQ / Breadcrumbs) for errors.

## 4. Bing Webmaster Tools (also powers many AI answers, Copilot, DuckDuckGo, ChatGPT search)

1. https://www.bing.com/webmasters → sign in → **Import from Google Search Console** (one click), or add the site manually.
2. Submit `sitemap.xml`.
3. Optional: turn on **IndexNow** in Bing Webmaster for instant re-indexing after big updates (like when the venue or ticket price is announced).

## 5. Test your structured data

- Rich Results Test: https://search.google.com/test/rich-results → test the home page (Event) and FAQ page.
- Schema validator: https://validator.schema.org
- Social preview: paste a page link into WhatsApp / X to check the share card.
- Speed: https://pagespeed.web.dev

## 6. Winning the "same name, different meaning" battle (off-site matters most)

Search engines decide *which* MedFest you are mostly from signals **outside** your website.
Do these consistently:

1. **Always write the full name in public places:** "MedFest Nigeria (MedFestNG) — Ondo City".
   Use it in your Instagram bio, captions, pinned post, flyers and press notes.
2. **Link your website in every profile** (Instagram bio link, TikTok, X, Facebook, LinkedIn, YouTube, WhatsApp Business).
   Use the same name and logo everywhere. When you add new profiles, add their links to `sameAs` in the Organization JSON-LD on every page (Instagram and TikTok are already there).
3. **Get listed:** Google Business Profile (if you have a base address), Eventbrite/Tix Africa/other Nigerian event listings once tickets are live, local Ondo and Nigerian event blogs, student union / UNIMED community pages.
4. **Get backlinks:** sponsors, vendors and partners should link to medfest.ng from their sites and posts. Every partner announcement = one link.
5. **Use the keywords naturally in social posts and hashtags:** #MedFestNG #MedFestV #MedFestOndo.
6. **YouTube:** upload highlight videos titled "MedFest Nigeria 2025 highlights — Ondo" with a link to the site in the description.
7. **Ask press and bloggers** to write "MedFest Nigeria (MedFestNG)" rather than just "MedFest".

Realistic timing: indexing in days; branded searches like "medfestng" usually settle in a few weeks; beating other
"MedFest" results for the bare word "medfest" takes months of the steps above.

## 7. When the real details are announced, update these

| Detail | Update here |
|---|---|
| Exact date (only if you ever decide to publish one) | `index.html` → JSON-LD `"startDate"` (now just `"2026-12"`, December only) ; `pages/faq.html` FAQ answer + its JSON-LD ; `llms-full.txt` |
| Venue | `index.html` Event → `location` (give it a real `name` and `streetAddress`) ; FAQ ; `llms-full.txt` |
| Ticket price | Add to the Event JSON-LD: `"offers": {"@type":"Offer","url":"https://medfest.ng/","price":"5000","priceCurrency":"NGN","availability":"https://schema.org/InStock","validFrom":"2026-10-15"}` ; FAQ ; `llms-full.txt` |
| Performers | Event JSON-LD → `"performer": [{"@type":"Person","name":"..."}]` |
| After any change | Change `lastmod` in `sitemap.xml`, then in Search Console use **URL Inspection → Request indexing** on the home page |

Important: the FAQ JSON-LD must always match the visible FAQ text, so edit both together.

## 8. Things to know / optional next steps (need visible or asset changes, so not done)

- The main heading on the home page is "MEDFEST V — The Fifth Chapter." Adding "Ondo" there would help, but it is a visible change, so it was left alone. The title tag, meta and structured data carry that signal instead.
- The site uses `.html` URLs (`/pages/about.html`). If your host supports it, clean URLs (`/about`) are nicer — but if you change them, update canonicals, sitemap and llms files.
- Add a simple custom `404.html`.
- When you add real text content in future (news, lineup, vendor list), write "MedFest Nigeria" / "Ondo" naturally in it — it is the best SEO there is.
- Photos in the gallery have alt text; keep describing new ones (for example "Guests dancing at MedFest 4.0 in Ondo").
- Page titles are visible in the browser tab and in Google results; that is the only visible effect of this SEO work.

## 8b. Favicon and share-image notes

- Google refreshes favicons slowly (days to weeks). After deploying, open `https://medfest.ng/favicon.ico` to confirm it loads, then request indexing of the home page in Search Console.
- Do not block `/favicon.ico` or `/assets/icons/` in `robots.txt` (they are not).
- WhatsApp/Facebook cache link previews. After deploying, refresh them with the Facebook Sharing Debugger (https://developers.facebook.com/tools/debug/) and re-share the link.
- To change the share image later, replace `assets/images/og/medfest-og.jpg` (keep 1200×630, under 300 KB).

## 9. Quick monthly checklist

- [ ] Search Console → Performance: look at branded queries
- [ ] Search Console → Pages: any "Not indexed" pages?
- [ ] Search your own name variants in Google and Bing
- [ ] Ask ChatGPT / Gemini / Perplexity / Claude "What is MedFest Nigeria (MedFestNG) in Ondo?" and note what they say
- [ ] Update llms-full.txt, FAQ and Event schema whenever facts change
