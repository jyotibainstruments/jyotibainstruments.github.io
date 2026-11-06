# JIE Website — © Jyotiba Instruments Enterprises

The public website of Jyotiba Instruments Enterprises (JIE), Belgaum: calibration, repairs and sales of industrial measuring instruments. A fully static Astro site hosted on **GitHub Pages** at <https://jyotibainstruments.github.io>, built to rank for calibration searches and to send every enquiry to **WhatsApp**.

## Documentation

| File | What it holds |
|---|---|
| `AGENTS.md` | Project rules: stack, design tokens, SEO, performance budgets, content integrity |
| `docs/CONTENT.md` | **Every fact that may appear on the site.** Nothing outside it is allowed |
| `docs/BRIEF.md` | Routes, page specs, design, SEO, performance budgets |
| `docs/PHASES.md` | The build order the site was constructed in |
| `docs/OPEN_QUESTIONS.md` | Questions for the owner; missing facts are omitted until answered |
| `docs/ASSETS_NEEDED.md` | Photos, logos and catalogue PDFs still to be supplied |
| `docs/SEO_CHECKLIST.md` | Launch and post-launch SEO steps |
| `docs/DECISIONS.md` | Every engineering decision and deviation, newest last |

## Requirements

- Node.js **22.23.4 or newer**

## Run locally

```bash
npm install

npm run dev        # dev server; drafted (unpublished) companies visible with PUBLIC_SHOW_DRAFTS=1
npm run preview    # serve the last production build from dist/
```

Windows tip: the TypeScript checker can need headroom on some machines. If `npm run build` runs out of memory, prefix with a larger heap:

```bash
export NODE_OPTIONS="--max-old-space-size=4096"   # (bash)
# or PowerShell: $env:NODE_OPTIONS="--max-old-space-size=4096"
```

## Quality gates

```bash
npm run check      # astro check — 0 errors, 0 warnings, 0 hints must pass
npm run build      # check + production build (the deploy gate)
npm run links      # linkinator on dist/ (skips the live origin and Google Maps links)
npm run lighthouse # Lighthouse CI on /, a service page, /products/ and /contact/ (see .lighthouserc.json)
npm run audit      # build + links + lighthouse in one go
```

Lighthouse needs a browser. On the owner's Windows machine:

```bash
CHROME_PATH="C:/Users/Vighnesh Nilajakar/AppData/Local/Chromium/Application/chrome.exe" npm run lighthouse
```

Targets (AGENTS.md): Performance 95+, Accessibility / Best Practices / SEO 100, LCP ≤ 2.0 s, CLS < 0.05. Current state: **100/100/100/100 on all four audited pages**.

## Deploy

- Push to `main` → the **"Deploy to GitHub Pages"** workflow in `.github/workflows/deploy.yml` builds and publishes automatically. Green run = live site updated.
- GitHub may also show a legacy "pages build and deployment" run failing on every push; that pipeline tries to run Jekyll over `.astro` files and is **harmless noise**. Only the *Deploy to GitHub Pages* run matters.
- Pages source is already set to *GitHub Actions* (Settings → Pages). Do not switch back to branch deployment.
- The built site is in `dist/` (with `public/.nojekyll`). Nothing to run remotely — it is a static host.

### Custom domain (if ever added)

Set `ASTRO_SITE` (canonical origin), add `public/CNAME`, redeploy, and update `docs/SEO_CHECKLIST.md` items.

## Day-to-day content editing

All page copy lives in **`src/data/*.json`** and is type-checked with Zod at build time — a wrong field, an over-long meta title/description or a broken reference **fails the build** with a readable message naming the file and field. There is no need to touch any `.astro` file for content.

| Task | File |
|---|---|
| Home page copy | `src/data/home.json` |
| Service pages (incl. FAQs) | `src/data/services.json` + `src/data/services-page.json` |
| Product page copy | `src/data/products-page.json` |
| Clients page / About / Contact | `src/data/clients-page.json`, `about-page.json`, `contact-page.json` |
| Locations hub + city pages | `src/data/locations.json` (each city `narrative` must stay ≥ 250 words) |
| Privacy / 404 | `src/data/privacy-page.json`, `not-found.json` |
| Process steps | `src/data/process.json` |

Rules that must not drift:

- **Facts only from `docs/CONTENT.md`.** If a fact is missing, omit it and add a line to `docs/OPEN_QUESTIONS.md` instead of guessing.
- Meta titles ≤ 60 characters, meta descriptions ≤ 155 characters (enforced by the schemas).
- Keep the schema-required fields intact when editing.

### Edit clients

`src/data/clients.json` — one entry per named customer, all four fields required:

```json
{
  "slug": "bagalkot-cement-factory",
  "name": "Bagalkot Cement Factory",
  "location": "Bagalkot",
  "sector": "Cement and construction",
  "featured": true,
  "city": null
}
```

- `sector` must be one of the seven sectors already used; `city` is one of `"belgaum" | "hubli" | "dharwad"` or `null` (null = shown on `/clients/` only, not the city pages).
- `featured: true` = appears in the home marquee and gets the gold tag on `/clients/`.
- Locations as printed in the company's documents; spellings follow the brochure. When the owner corrects a spelling, change it here and it propagates to every page.

## Publish a company (brand) and its catalogue PDF

Five brand seeds exist in `src/data/companies.json`: Mahr, Mitutoyo, Insize, Baker, WIKA — all with `published: false`.

1. **Add the catalogue PDF** at `public/catalogues/<slug>.pdf` (e.g. `public/catalogues/mahr.pdf`). The name must use the company's `slug`.
2. **Add the optional first-page poster** at `public/catalogues/<slug>.jpg`.
3. **Fill the company entry:**

```json
{
  "slug": "mahr",
  "name": "Mahr",
  "logo": "/Logo/mahr.svg",              // optional: put the logo file in public/ and set the path
  "intro": "…",                          // optional description text (facts only)
  "pdf": "/catalogues/mahr.pdf",         // must match "/catalogues/<slug>.pdf" exactly, or null
  "categories": [                        // optional chips that open the viewer at a page
    { "name": "Length measuring machines", "page": 2 },
    { "name": "Height gauges", "page": 4 }
  ],
  "highlights": [ { "name": "Digimar 817 CLT" } ],
  "published": true
}
```

4. **Set `published: true`.** The build then generates `/products/<company>/`, adds it to the sitemap, nav dropdown, footer and home carousel.
- A company with `published: true` but **no PDF** shows a "Catalogues coming soon" panel — that is supported and safe.
- `PUBLIC_SHOW_DRAFTS=1 npm run dev` previews unpublished companies during development only.

## Replace a PDF

Overwrite the file at `public/catalogues/<slug>.pdf` with the same filename, commit, push. No code change needed. If the category page numbers change, update the `categories[].page` values in `companies.json`.

## Change the WhatsApp number

- The number lives in **one place**: `whatsapp` inside `src/config/site.ts`. Every WhatsApp button on the site is built from it; it is never hard-coded in components.
- The pre-filled message templates live in `src/lib/whatsapp.ts` (`productEnquiry`, `serviceEnquiry`).
- Each button carries a `data-wa="<placement>"` attribute used by analytics.

## Analytics (optional)

The site ships no third-party script by default. Setting the environment variable `PUBLIC_GA_ID` to a GA4 Measurement ID (`G-XXXXXXX`) during build enables a self-contained gtag loader with IP anonymisation and a single `whatsapp_click` event carrying the button placement. Everything analytics-related renders only when the ID is set — matching `src/data/privacy-page.json`. Add it as a GitHub Actions secret/env or locally when testing.

## Unconfirmed claims

Flags in `src/config/site.ts` (`showIsoClaim`, `showDealerStatus`, …) are all `false`. Flip one **only** after the owner supplies evidence (certificate, dealer letter). ISO/IEC 17025 must never be worded as "NABL" or "accredited".

## Repository layout

```
src/pages/            one .astro file per route (plus templates for services, products, locations)
src/components/       section + UI components (scoped <style> blocks, plain CSS)
src/layouts/          BaseLayout (head, SEO, analytics) + SiteLayout (shell)
src/data/             all page copy and datasets, Zod-validated in src/lib/content.ts
src/config/site.ts    name, contacts, WhatsApp number, unconfirmed-claim flags
src/lib/              whatsapp.ts (enquiry URLs), seo.ts (JSON-LD), url.ts, content.ts, slug.ts
src/styles/           tokens.css (design tokens) + global.css (reset, buttons, focus, print)
public/               favicons, Logo/, catalogues/, pdfjs/ (vendored viewer), robots.txt/sitemap generated into dist
scripts/brand-assets.mjs   rebuilds optimised logo variants into src/assets/brand/
docs/                 the source-of-truth documents (see table above)
```
