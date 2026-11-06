# Build phases

Run one phase per session with `/phase <number>`. Each phase ends with a green `npm run build`, a short summary, and a stop. Do not start the next phase unprompted.

## Phase 1: Foundation
- Scaffold Astro (static, TypeScript strict) in the repo root. Keep `AGENTS.md`, `opencode.json`, `docs/`, `design/`, `.opencode/` intact.
- Install: `@astrojs/sitemap`, `@fontsource-variable/plus-jakarta-sans`, `@fontsource-variable/inter`, `zod`, `sharp`, `svgo` (dev). Nothing else.
- `src/styles/tokens.css` (all tokens from AGENTS.md, type scale, spacing, radius, shadows) and `global.css` (reset, base typography, focus ring, skip link, reduced-motion).
- `src/config/site.ts`: name, tagline, offices, phones, emails, GSTIN, WhatsApp number, and the unconfirmed-claim flags (all `false`), all taken from CONTENT.md. `src/lib/whatsapp.ts`, `src/lib/url.ts`, `src/lib/seo.ts` (JSON-LD builders).
- `BaseLayout.astro` with full head (meta, canonical, OG, Twitter, favicons, font preloads, JSON-LD slot).
- Optimise the logo with SVGO into `src/assets/brand/`; generate favicons, `apple-touch-icon`, `og-default.png` with a script in `scripts/`.
- `astro.config.mjs` with `site`/`base` from env, `trailingSlash: 'always'`, sitemap, prefetch.
- Scripts: `build` (`astro check && astro build`), `preview`, `links` (linkinator on `dist`), `lighthouse` (`@lhci/cli` against `dist`), `audit` (all three).
- `.github/workflows/deploy.yml` for GitHub Pages. Create empty `docs/OPEN_QUESTIONS.md`, `ASSETS_NEEDED.md`, `DECISIONS.md`.
- Acceptance: blank branded page builds, passes Lighthouse 100 SEO and accessibility, favicons present.

## Phase 2: Site shell
- Components: TopBar, Header (dropdown nav, mobile sheet), Footer, FloatingWhatsApp, Breadcrumbs, Button, WhatsAppButton, Section, Card, Placeholder, Carousel, Faq, ProcessSteps.
- Data files and Zod schemas: `companies.json` (five seeds, unpublished), `clients.json` (all 45 plus `featured`), `services.json` (skeleton), `offices.json`.
- Navigation reads from data. Products dropdown shows published companies only.
- Acceptance: header works by keyboard and touch at 360px, 768px, 1280px; no layout shift; tap targets 44px.

## Phase 3: Home
- Build all 11 home sections from BRIEF.md section 5. Hero image slot uses `Placeholder` if no photo exists.
- JSON-LD `LocalBusiness` with the two real office addresses.
- Acceptance: Lighthouse mobile 95+ performance, home JS 10 KB gzip or less, no console errors.

## Phase 4: Services
- Service template and all pages in BRIEF.md section 2 (6 disciplines, on-site, repairs, spare parts, hub and calibration overview). Content from CONTENT.md only. 3 to 5 FAQs per page, each answerable from CONTENT.md.
- `Service` and `BreadcrumbList` JSON-LD. Internal links between related services.
- Acceptance: every page has unique title, description, one h1; no invented facts (run the content check in `/audit`).

## Phase 5: Products and catalogue viewer
- Download PDF.js official release into `public/pdfjs/`; implement `CatalogueViewer` facade, new-tab external links, fullscreen, `#page=` chips, enquiry bar.
- Products hub and `[company]` pages generated from `companies.json`. For testing only, create a throwaway 3-page PDF containing a `wa.me` link and verify the link opens outside the iframe. Delete the test PDF afterwards.
- Add `PUBLIC_SHOW_DRAFTS` handling; verify a production build omits unpublished companies from pages, nav, carousel and sitemap.
- Acceptance: viewer works on a 360px-wide viewport and on desktop; nothing from PDF.js loads before the tap (check the network panel or a Playwright request log).

## Phase 6: Clients, About, Contact, Locations, legal
- Clients page by sector, About, Contact (all offices, `tel:` and `mailto:` links, map links), `/locations/` hub with Belgaum, Hubli and Dharwad pages per the 250-word rule, Privacy, branded 404.
- Acceptance: all contact data matches CONTENT.md character for character.

## Phase 7: Polish, SEO and launch readiness
- Pass over spacing, hover and focus states, reduced-motion behaviour, dark-on-gold contrast, print stylesheet for contact page.
- Run `npm run audit`; fix everything below the targets in AGENTS.md. Run the QA subagent (`@qa-reviewer`) and fix its findings.
- Write `README.md` (run, deploy, add a company and PDF, replace a PDF, edit clients, change WhatsApp number) and `docs/SEO_CHECKLIST.md`.
- Final summary lists every open question and every missing asset so the owner can supply them before go-live.
