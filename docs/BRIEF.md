# JIE Website Brief

Companion to `AGENTS.md` (rules) and `CONTENT.md` (facts). This file covers what to build and how it should look and behave.

## 1. Goals and audiences

1. **Rank** for searches such as calibration lab/services in Belgaum, Hubli, Dharwad; pressure gauge, torque wrench, vernier, micrometer calibration; and supplier/dealer searches for the brands JIE sells.
2. **Convert** visitors into WhatsApp conversations (primary) or phone calls (secondary).
3. **Reassure** buyers: named customers, traceable calibration, clear process, real addresses.

Audiences: quality and maintenance engineers in factories; construction and civil testing labs (cement, concrete cube testing, UTM/CTM and jack calibration); hospitals and medical colleges; procurement staff comparing suppliers. Most traffic will be on phones.

## 2. Routes (trailing slash on all)

```
/                                   Home
/about/                             About JIE
/services/                          Services hub
/services/calibration/              Calibration overview (6 discipline cards)
/services/calibration/mechanical-pressure/
/services/calibration/electro-technical/
/services/calibration/thermal/
/services/calibration/fluid-flow/
/services/calibration/medical/
/services/calibration/civil/        Civil, construction and material testing
/services/on-site-calibration/
/services/repairs-and-tool-error-adjustment/
/services/spare-parts-and-instruments/
/products/                          Products hub (company cards)
/products/[company]/                One page per company (only if published)
/clients/                           All named customers by sector
/locations/                         Offices hub
/locations/belgaum/  /locations/hubli/  /locations/dharwad/
/contact/
/privacy/                           Short; required if analytics enabled
/404                                Branded 404
```
Dharwad has no office in the source. Its page covers "service area" content and the many Dharwad customers listed in CONTENT.md. Pune and Ahmedabad appear on `/locations/` and `/contact/` only, as listed offices.

## 3. Design system

**Mood:** clean, airy, photo-led, confident. Think a modern industrial supplier, not a SaaS landing page. Light `--bg` (#EEF5F8) everywhere, white cards, crimson panels for emphasis, gold only on interactive elements: primary buttons, the active nav underline, focus rings and the short heading underline bar.

**Layout:** container max 1200px, side gutter 20px (24px from 768px up) using `padding-inline: max(20px, env(safe-area-inset-left))`. Section vertical padding `clamp(56px, 8vw, 104px)`. Background rhythm: `--bg`, white, `--bg`, crimson panel, `--bg`... never two crimson panels adjacent, and at most one solid `--crimson` band or panel per page (the footer and top bar are `--crimson-900` and do not count). Where two same-tone sections meet, a 1px `--line-soft` top border marks the join. Inner-page headers are a slim `--crimson-50` band with the breadcrumb and h1 in `--crimson-900`.

**Type:** headings Plus Jakarta Sans Variable (800 for h1, 700 for h2/h3, letter-spacing -0.02em, `text-wrap: balance`). Body Inter Variable 17px/1.65, `text-wrap: pretty`. Scale: h1 `clamp(2.25rem, 1.6rem + 3vw, 3.75rem)`, h2 `clamp(1.75rem, 1.3rem + 1.8vw, 2.5rem)`, h3 1.25rem, small 0.875rem. Keep line length at or under 68ch (`--measure`). Sentence case everywhere. No all-caps eyebrow labels on every section; use one small eyebrow only in the hero. Phone numbers, addresses and the GSTIN use tabular numerals.

**Shape and depth:** card radius 16px, button radius 12px, pills 999px. Cards are white with a 1px `--line` border and `--shadow-card` (`0 1px 2px` at 6% ink, `0 8px 24px` at 8% ink). Linked cards raise to `--shadow-card-hover` and translate up 2px over 150ms, both disabled under `prefers-reduced-motion`. Borders 1px `--line` for cards and dividers; never the only boundary for a control.

**Buttons:**
- Primary (gold fill, `--gold-edge` 1px border, ink text, 48px high, bold, radius 12px): all main CTAs including WhatsApp (with the WhatsApp glyph in ink).
- Secondary (crimson fill, white text): "View catalogue", "Learn more".
- Ghost (crimson text, crimson 1.5px border, transparent fill) for tertiary actions.
- On crimson panels: primary stays gold; secondary becomes white fill with crimson text; ghost becomes white text and border.
- Hover: primary to `--gold-hover`, secondary to `--crimson-900`, ghost to `--crimson-50`. Pressed: `translateY(1px)`, primary to `--gold-pressed`. Disabled: 45% opacity and no pointer events.
- Focus: 3px `--gold` ring with a 1px `--crimson-900` keyline immediately outside (white keyline on crimson surfaces). The keyline is the compliant 3:1 boundary; gold alone is 1.96:1 on `--bg`.

**Signature detail:** a thin ruler-tick strip (CSS `repeating-linear-gradient`, crimson at 18% opacity) under the hero and above the footer. It is the one measurement-themed motif; do not add others (no dials, gauges or gradients-with-glow).

**Imagery:** real photographs of the lab, instruments and team from the owner (see `ASSETS_NEEDED.md`). No "to be supplied" caption ever renders in production: where an image is missing, redesign the slot around real content (the home hero uses a quick-contact card until a photo exists). Do not draw fake product illustrations.

**Motion:** subtle only. 150 to 200 ms hover transitions, fade-up on scroll via CSS `animation-timeline: view()` where supported, otherwise no animation. Everything honours `prefers-reduced-motion`.

## 4. Global components

**Top bar** (`--crimson-900`, 36px, hidden under 640px except one `tel:` link): primary phone numbers as `tel:` links, one email as `mailto:`, plain text "Belgaum · Hubli · Dharwad · Pune · Ahmedabad".

**Header** (white, sticky, 72px, 1px bottom border): logo (44px high, links to `/`), nav, gold WhatsApp button "Chat on WhatsApp". Nav: Home, About, **Services ▾**, **Products ▾**, Clients, Contact.
- Services dropdown: Calibration (with the six disciplines as a second column), On-site calibration, Repairs and tool-error adjustment, Spare parts and instruments.
- Products dropdown: one row per published company (logo or wordmark + name), then "All products".
- Dropdowns use a button with `aria-expanded`, open on click and on hover for pointer devices, close on Esc and outside click, are fully keyboard operable. No hover-only behaviour.
- Under 960px: hamburger opens a full-height sheet; groups are `<details>` accordions; the WhatsApp button sits pinned at the bottom of the sheet.

**Floating WhatsApp button:** fixed bottom-right, 56px gold circle with glyph, `aria-label="Chat on WhatsApp"`, offset by `env(safe-area-inset-bottom)`. Hidden while the catalogue viewer is open.

**Footer** (`--crimson-900`, white text, full-colour logo on a white plate): columns for company summary and GSTIN; Services links; Products links; Contact (Belgaum lab and Hubli addresses, phones, emails). Bottom bar: copyright "© {current year} Jyotiba Instruments Enterprises", Privacy link. Ruler-tick strip above.

**Breadcrumbs** on all inner pages (visible and in JSON-LD).

**Other shared components:** `Section`, `Card`, `Button`, `WhatsAppButton`, `Carousel` (CSS scroll-snap, arrow buttons, swipe, no autoplay), `Faq` (`<details>`), `ProcessSteps`, `StatRow`, `CatalogueViewer`, `MobileActionBar`, inline `icons/Icon`, `Seo`.

## 5. Page specs

**Home**, in this order:
1. *Hero.* H1 "Calibration, repairs and sales of precision measuring instruments". Small eyebrow with the cities served. Sub-copy adapted from the brochure description in CONTENT.md. Buttons: gold "Chat on WhatsApp", secondary "Explore products". Right side: photo slot. Under it, three trust chips using only confirmed claims: "Traceable to National / International Standards", "2000+ customers" (company's stated claim), "Calibration lab in Belgaum".
2. *Services.* Four cards: Calibration, On-site calibration, Repairs and tool-error adjustment, Spare parts and instruments. Each links to its page.
3. *Products carousel.* One card per published company (logo or wordmark, name, "View catalogue"). Card links to `/products/[company]/`. Snap carousel with prev/next buttons; the section heading links to `/products/`.
4. *Calibration disciplines.* Six tiles with 3 to 4 example instruments each (from CONTENT.md), linking to the discipline pages.
5. *On-site calibration highlight* (a `--crimson-50` panel with a crimson left border, inside the discipline grid). Short benefits (convenient, reliable, professional; saves time and travel cost) and the instruments listed in CONTENT.md.
6. *Process.* Receive and inspect, Calibrate, Documentation, Return.
7. *Why JIE.* The five reasons from the brochure, omitting any unconfirmed claim.
8. *Clients.* Logo marquee of featured clients (CSS-only scroll, pauses on hover and focus, static grid under reduced motion), link to `/clients/`.
9. *Industries.* Cement and construction, automotive and engineering, power and railways, medical and healthcare, government.
10. *Locations.* Belgaum lab and Hubli branch cards with address, phone, Google Maps link (plain link, no embed).
11. *Final CTA band* with WhatsApp button and phone numbers.

**Service pages** (all share a template): H1 with the service and primary city, 2-paragraph intro from CONTENT.md, instrument list as a two-column checklist, "How it works" (4 steps), on-site note where applicable, related services, FAQ of 3 to 5 questions answerable from CONTENT.md only, WhatsApp CTA that includes the service name in the message. Civil discipline page features the civil key clients.

**Products hub:** intro sentence, grid of company cards, a line explaining that catalogues open on the site and every product can be enquired on WhatsApp.

**Company page:** breadcrumb, H1 "{Company} instruments: catalogue and enquiry", short intro (from `companies.json` `intro` if set, otherwise the standard JIE copy in CONTENT.md), category chips if `categories` exist (each opens the viewer at that page), `CatalogueViewer`, a "Can't find a product?" box with a WhatsApp button, "Other companies" row. If `pdf` is missing, show "Catalogue coming soon" and the WhatsApp button only.

**Clients:** all customers from CONTENT.md grouped by sector as a clean text grid (logos only where files exist in `ASSETS_NEEDED.md` terms). Intro states the company's "2000+ customers" claim.

**About:** company description, what JIE does, service principles (simple and cost-effective pricing, limit calibration to equipment that needs it, maintain traceable certification), locations. No founding story, no team bios (none supplied).

**Contact:** all offices with addresses and phone numbers as `tel:` links, emails as `mailto:`, GSTIN, map links, a prominent WhatsApp button. No contact form (WhatsApp is the lead path).

**Location pages (Belgaum, Hubli, Dharwad):** unique content only: address and map link, services available, customers in that city from CONTENT.md, on-site calibration note. Each at least 250 words of genuinely distinct text. If you cannot reach that without inventing facts, merge the page into `/locations/` and note it in `DECISIONS.md`.

## 6. Data model (`src/data/`)

- `companies.json`: `{ slug, name, logo?, intro?, pdf?, categories?: [{name, page}], highlights?: [{name, code?}], published }`. Production builds render only `published: true`; set `PUBLIC_SHOW_DRAFTS=1` in dev to see the rest. Seed with the five candidates in CONTENT.md, all `published: false`, `pdf` unset.
- `clients.json`: `{ name, location, sector, featured, logo? }`.
- `services.json`: slug, title, summary, instruments[], faq[].
- `offices.json`: from CONTENT.md.
- Validate all with Zod at build; a bad entry fails the build with a readable message.

## 7. Catalogue viewer (`CatalogueViewer.astro`)

The owner provides the PDFs (some will contain clickable WhatsApp links inside the PDF) and places them at `public/catalogues/<slug>.pdf`. You build the viewer.
- **Facade first:** render a card with page-1 poster (`public/catalogues/<slug>.jpg` if present, otherwise a neutral cover with the brand name), the gold button "Open catalogue", a plain `<a href>` "Open PDF in a new tab" and "Download PDF". Nothing from PDF.js loads until the tap.
- **On tap:** insert an `<iframe>` pointing to the self-hosted PDF.js viewer: `{base}pdfjs/web/viewer.html?file={encoded pdf url}#zoom=page-width` (and `#page=N` for category chips). Height `min(85svh, 900px)`, `title` set, plus a fullscreen toggle button on the wrapper.
- **PDF.js setup:** download the latest stable official `-dist.zip` release from github.com/mozilla/pdf.js/releases, unpack to `public/pdfjs/`, delete the sample PDF. Check the current release layout and docs before wiring it. Light theming only (toolbar in crimson via an override stylesheet linked from `viewer.html`); do not alter functionality.
- **Critical:** PDF links must not navigate inside the iframe (wa.me refuses framing). Set the viewer's `externalLinkTarget` to open in a new tab (BLANK) via the supported option or event hook, or by patching the default in the self-hosted copy. Acceptance test: tapping a `wa.me` link inside a test PDF opens WhatsApp or a new tab, on desktop and on a phone.
- **No-JS and crawlers:** the plain PDF anchor works without scripts.
- **Product-level enquiry bar** under the viewer: gold "Enquire on WhatsApp" opening `waLink({ subject: company })`, and a small input "Product name or code" that is appended to the message before opening.

## 8. SEO details

- `BaseLayout` props: title, description, canonical path, `ogImage`, `jsonLd[]`, `noindex?`. Titles end with " | JIE" (or the full name if it fits 60 chars).
- Title patterns: service `"{Service} in Belgaum and Hubli | JIE"` (only for cities supported by CONTENT.md); company `"{Company} instruments, catalogue and enquiry | JIE"`.
- `public/og-default.png` 1200x630 generated by a script (`sharp`) from the logo on `--bg` with a crimson bar.
- `@astrojs/sitemap` excludes `/404`, drafts and `noindex` pages. `robots.txt` generated with the sitemap URL from the configured `site`.
- Internal linking: every service page links to 2+ related services and the matching locations; every company page links to calibration and repair for that brand's instruments.
- Add `docs/SEO_CHECKLIST.md` (Google Search Console verification, submit sitemap, Google Business Profile per office with the same name, address and phone as the site). This is for the owner, not code.

## 9. Performance and analytics

- Inline critical CSS (Astro `inlineStylesheets: 'auto'`), no render-blocking third-party requests, no external font CDNs.
- One hero image max 120 KB (AVIF), `fetchpriority="high"`, preloaded.
- Prefetch internal links on hover (`prefetch: { defaultStrategy: 'hover' }`). No view transitions.
- Analytics optional: if `PUBLIC_GA_ID` is set, load gtag after first user interaction or idle; events `wa_click` (placement), `tel_click`, `catalogue_open` (company), `catalogue_pdf_open`. No cookie banner logic beyond a privacy page mention.

## 10. Deployment (GitHub Pages)

- `.github/workflows/deploy.yml` using `withastro/action` and `actions/deploy-pages` (check the current versions in the Astro deploy guide). Triggers: push to `main` and manual.
- `astro.config.mjs` reads `ASTRO_SITE` and `ASTRO_BASE` (defaults `https://<owner>.github.io` and `/`). Project sites need `base: '/<repo>'`; every internal link and asset URL goes through a `url()` helper so changing the base never breaks links.
- Custom domain later: add `public/CNAME`, set `ASTRO_SITE` to the domain, `ASTRO_BASE=/`.
- README (written at the end) explains: run locally, add a company (data entry + PDF upload via the GitHub web UI), replace a PDF, add a client, change the WhatsApp number.
