# JIE Website: project rules

You are building the public website for **Jyotiba Instruments Enterprises (JIE)**, an industrial instrument calibration, repair and sales business based in Belgaum, Karnataka, India. The site is fully static, hosted on GitHub Pages, and exists to rank on Google for calibration and instrument searches and to send enquiries to WhatsApp.

Read these before writing code. They are the source of truth:
- `docs/CONTENT.md`: every fact that may appear on the site. Nothing else is allowed.
- `docs/BRIEF.md`: design system, page specs, SEO, performance budgets.
- `docs/PHASES.md`: the build order. Work one phase at a time.

## Content integrity (highest priority)

An earlier draft of this site shipped invented phone numbers, GSTIN, addresses, clients and brands. Never repeat that.
- Use only facts from `docs/CONTENT.md`. If a fact is missing, omit it. Do not guess, round, "improve" or infer.
- Never invent: phone numbers, addresses, years or "since" dates, counts, certifications, accreditation bodies (never write "NABL"), client names, brand names, product names or codes, prices, testimonials, awards.
- Claims marked `UNCONFIRMED` in `CONTENT.md` stay behind flags in `src/config/site.ts` (default `false`) and are not rendered.
- If you need a fact that is not there, add it to `docs/OPEN_QUESTIONS.md` and carry on without it.
- Missing images or logos: render the neutral placeholder component, and list the file in `docs/ASSETS_NEEDED.md`. Never use stock-photo hotlinks or AI-invented logos.

## Stack (fixed; do not substitute)

- **Astro** (latest stable, `output: 'static'`), TypeScript strict. Check docs.astro.build for current APIs before using them.
- **Plain CSS**: global tokens in `src/styles/tokens.css`, component-scoped `<style>` blocks. No Tailwind, no UI framework, no CSS-in-JS.
- **No client JS framework.** Interactivity is small vanilla `<script>` blocks only: mobile nav and dropdowns, carousel buttons, catalogue facade, analytics events.
- Fonts: self-hosted variable WOFF2 through Fontsource (`@fontsource-variable/plus-jakarta-sans` for headings, `@fontsource-variable/inter` for body), latin subset only, `font-display: swap`, preload the two files used above the fold.
- Images: `astro:assets` (`<Image>`/`<Picture>`) with AVIF and WebP, explicit width and height, `loading="lazy"` except the single LCP image.
- SEO: `@astrojs/sitemap`, JSON-LD built in typed helper functions, `trailingSlash: 'always'`.
- PDF catalogues: self-hosted PDF.js viewer, loaded only after a tap (see BRIEF section 7). The owner supplies the PDFs; you build the viewer and pages.

## Commands

```
npm run dev        # local dev server
npm run build      # astro check && astro build
npm run preview    # serve dist/
npm run audit      # build, link check, Lighthouse CI (see package.json scripts you create)
```
Create these scripts in Phase 1. A phase is not done until `npm run build` passes with zero errors and zero warnings.

## Design tokens (exact values; do not drift)

| Token | Value | Use |
|---|---|---|
| `--bg` | `#EEF5F8` | Page background (the main colour) |
| `--surface` | `#FFFFFF` | Cards, header, white plates |
| `--on-crimson` | `#FFFFFF` | Text and icons on crimson surfaces |
| `--crimson` | `#74092B` | Brand accent: links, icon accents and the single solid emphasis band on a page |
| `--crimson-900` | `#4E061D` | Footer and top bar, hover and pressed states, dark text on tints |
| `--crimson-50` | `#F6E8EC` | Tinted panels and the inner-page header band |
| `--gold` | `#E5A524` | **Interactive only:** primary buttons, active nav underline, focus rings, the short heading underline bar |
| `--gold-hover` | `#F0B429` | Primary button hover |
| `--gold-pressed` | `#C98F14` | Primary button pressed |
| `--gold-edge` | `#B97F0F` | 1px border on gold buttons and the floating button |
| `--gold-on-crimson` | `#F0C45A` | Small text and links on crimson |
| `--ink` | `#111111` | Body text (matches the logo black) |
| `--ink-2` | `#4A4F57` | Secondary text |
| `--ink-3` | `#5E646C` | Captions (minimum size 14px) and form-control borders |
| `--line` | `#B9C8D1` | Card and divider hairlines (never the only cue for an input) |
| `--line-soft` | `#D5E0E6` | Subtle dividers inside cards and between same-tone sections |

Contrast rules (measured; enforced by `scripts/check-contrast.mjs`):
- Ink on gold = 8.8:1, so **gold buttons always use `--ink` text**. White on gold fails (2.2:1).
- Gold is never used as text colour on `--bg` or white (2.0/2.2:1). Use it as a fill, border or indicator only: primary buttons, active nav, focus and the heading bar.
- Gold on crimson = 5.4:1. It is allowed for large text (24px+) and icons; use `--gold-on-crimson` (`#F0C45A`, 7.0:1) for small text and links on crimson.
- White/`--on-crimson` on crimson = 11.6:1; on `--crimson-900` = 15.4:1. `--bg` on crimson is 10.5:1 and on `--crimson-900` 13.9:1.
- Body text: `--ink` on `--bg` 17.1:1, `--ink-2` 7.5:1, `--ink-3` 5.4:1. On `--surface`: 18.9 / 8.2 / 6.0:1.
- Form controls use a 1.5px `--ink-3` border at rest (6.0:1 on white) and a `--crimson` border on focus (11.6:1). `--line` is 1.7:1 on white, so it is not used as the only input boundary.
- Focus ring: 3px `--gold` plus a 1px `--crimson-900` keyline immediately outside (white keyline on crimson surfaces). The keyline is the compliant 3:1 boundary (13.9:1 on `--bg`, 15.4:1 on white); gold against the keyline is 7.1:1.
- `--gold-edge` against `--bg` is 3.1:1 and against white 3.4:1, so gold buttons keep a visible edge on pale surfaces.
- Use `#74092B` exactly (`rgb(116, 9, 43)`). The logo SVG's letter fill is `#76122E`; leave the SVG untouched.
- No WhatsApp green. WhatsApp buttons are gold with the WhatsApp glyph, so the palette stays strictly brand-derived.
- At most one solid `--crimson` band or panel per page. The footer and top bar are `--crimson-900`; inner-page headers are `--crimson-50`.

## Logo

`design/jie-logo-original.svg` is the master. Never recolour, stretch or re-trace it. Optimise with SVGO (keep fills) into `src/assets/brand/`. A single-colour white version is allowed only on the crimson footer. Generate favicons and `apple-touch-icon` from it with `sharp`.

## WhatsApp enquiries

- One helper, `src/lib/whatsapp.ts`, builds every WhatsApp URL: `https://wa.me/<number>?text=<encodeURIComponent(message)>`. The number comes from `src/config/site.ts` only. Never hard-code it in components.
- Product or catalogue message: `Hello JIE, I am interested in {product name} {code}. Please provide specifications and pricing.` Generic: `Hello JIE, I would like to know more about {service}.`
- Links open in a new tab with `rel="noopener"` and carry `data-wa="<placement>"` for analytics.

## SEO rules

- One `<h1>` per page. Unique `<title>` (max 60 chars) and meta description (max 155) on every page, written from CONTENT.md facts.
- Canonical, Open Graph and Twitter tags from a single `BaseLayout`. `lang="en-IN"`.
- JSON-LD: `LocalBusiness` on home and contact (real addresses only), `Service` on service pages, `BreadcrumbList` on all inner pages, `CollectionPage` on company pages. No `Product`, `Offer` or `Review` markup (no price or review data exists).
- Meaningful internal links, descriptive anchor text, real `<a href>` for all navigation.
- Do not create doorway pages. Location pages exist only where CONTENT.md supports unique content.

## Performance and quality gates

Targets on mobile Lighthouse for `/`, a service page and a company page: Performance 95+, Accessibility 100, Best Practices 100, SEO 100. LCP 2.0 s or better, CLS under 0.05, total blocking time near zero.
- JS on the home page: 10 KB gzip or less (analytics excluded). CSS: 25 KB gzip or less site-wide.
- PDF.js and all PDF files load only after a user tap.
- WCAG 2.2 AA: skip link, visible focus ring (gold, 3px), 44px minimum tap targets, keyboard-operable menus, `prefers-reduced-motion` respected (no auto-moving carousel under reduced motion).
- Every image has a meaningful `alt` (or `alt=""` if decorative).

## Working style

- One phase per session. At the end of each phase: run `npm run build`, list files changed, list new entries added to `OPEN_QUESTIONS.md` and `ASSETS_NEEDED.md`, and stop.
- Prefer small, composable Astro components in `src/components/`. Content lives in `src/data/*.json` (typed, validated at build with Astro content collections or Zod), never hard-coded in templates.
- Do not add dependencies beyond the stack above without writing the reason in `docs/DECISIONS.md`.
- Never commit secrets. Analytics ID comes from `PUBLIC_GA_ID` (optional).
- When unsure about a design choice, follow `docs/BRIEF.md`; when it is silent, choose the simpler, lighter option.
