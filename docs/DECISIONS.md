# Decisions

Deviations from `AGENTS.md`, `docs/BRIEF.md` or `docs/PHASES.md`, with the reason. Newest last.

## Phase 0 — baseline

- **2026-11-06 — Git baseline.** Repository initialised on `main` to match the deploy workflow. The supplied kit is committed before any code. `core.autocrlf` is `true` on the owner's Windows machine; line-ending warnings are expected. Add `.gitattributes` later only if diffs become noisy.

## Phase 1 — foundation

- **2026-11-06 — Deployment target.** Confirmed by the owner: user site at `https://jyotibainstruments.github.io`, `base: '/'`. `ASTRO_SITE` and `ASTRO_BASE` remain environment overrides.
- **2026-11-06 — Astro 7.4.7.** Current stable at build time. The brief was written against an older Astro. Changes applied:
  - `compressHTML: true`, because Astro 7 defaults to `'jsx'` whitespace handling and can drop spaces between inline elements.
  - The Rust compiler is strict about unclosed tags and invalid nesting; templates will be written accordingly.
  - `output: 'static'` remains valid.
- **2026-11-06 — TypeScript 6.0.3, not 7.x.** `@astrojs/check` peers on `typescript@^5 || ^6`; TypeScript 7.0.2 is outside that range. Pin 6.0.3.
- **2026-11-06 — `@astrojs/check` added.** `astro check` requires it, but the Phase 1 install list omitted it. It is a dev dependency.
- **2026-11-06 — `@lhci/cli` and `linkinator` added.** Phase 1 requires `links`, `lighthouse` and `audit` scripts, which need these dev dependencies. No other packages were added.
- **2026-11-06 — Zod 4.6.7 installed directly.** It matches the version Astro 7 already depends on, so npm dedupes it. Office data is validated at build; a bad entry fails the build.
- **2026-11-06 — Offices live in `src/data/offices.json`.** `src/config/site.ts` imports and re-exports them, so phone numbers and addresses have one source. This satisfies the Phase 1 requirement that `site.ts` exposes offices without duplicating facts.
- **2026-11-06 — Fonts vendored from Fontsource.** The Fontsource variable CSS includes every subset. The two latin variable WOFF2 files were copied into `src/assets/fonts/`, with their OFL licences, and declared with `@font-face` in `global.css`. This keeps the site latin-only, self-hosted, cacheable and preloadable. No external font requests.
- **2026-11-06 — Focus ring: gold with a crimson keyline.** Owner approved. The ring is 3px gold plus a 1px `--crimson-900` keyline (white on crimson surfaces). Pure gold is 2.4–2.6:1 against `--bg`/white, below the 3:1 non-text contrast requirement in WCAG 2.2 SC 1.4.11. The keyline keeps the brand's gold ring while providing a compliant boundary. Lighthouse will not catch this; it needs manual review.
- **2026-11-06 — Logo master.** `design/jie-logo-original.svg` is the only master, optimised with SVGO into `src/assets/brand/jie-logo.svg`. Fills are preserved (`#111111`, `#76122E`). `design/JIE_logo_sharp_vector_clean.svg` is a reconstruction with a baked-in white background and is not used. A white footer version will be produced with a CSS filter in Phase 2, not by recolouring the file.
- **2026-11-06 — No `favicon.ico`.** `sharp` cannot emit ICO. The site ships `favicon.svg`, 32px and 192px PNGs, and `apple-touch-icon.png`, which current browsers accept.
- **2026-11-06 — Generated `logo-512.png`.** Used for `Organization`/`LocalBusiness` JSON-LD, because search engines prefer a raster logo with a stable size.
- **2026-11-06 — Prefetch is global.** `prefetchAll: true` with the `hover` strategy. The brief asks for hover prefetching; Astro's `prefetchAll` defaults to `false`, so `defaultStrategy` alone would prefetch nothing.
- **2026-11-06 — Link checks skip the production origin.** Absolute canonical/JSON-LD URLs point at the not-yet-deployed domain. `npm run links` checks the local build and skips `https://jyotibainstruments.github.io` so it does not test the live site. Revisit after launch.
- **2026-11-06 — Docs seeded, not empty.** Phase 1 says create empty `OPEN_QUESTIONS.md`, `ASSETS_NEEDED.md` and `DECISIONS.md`. They are seeded with the known items from CONTENT.md section 9 and the build decisions, so the owner has an actionable checklist.
- **2026-11-06 — Analytics deferred.** `PUBLIC_GA_ID` is not wired yet. The privacy page and the conditional gtag loader arrive in Phase 7; no third-party requests are made now.
- **2026-11-06 — Temporary home page.** Phase 1 ships a branded page using only CONTENT.md facts (name, tagline, descriptor, cities, lab/branch statement). It is replaced by the full 11-section home page in Phase 3.
- **2026-11-06 — Tests and audits.** `npm run build` runs `astro check --minimumFailingSeverity warning` so warnings fail the build. `npm run links` uses linkinator on `dist/`; Lighthouse CI uses a local static server and a filesystem report so reports are not uploaded publicly.
- **2026-11-06 — Lighthouse browser on the owner's machine.** Only Microsoft Edge is installed, so `npm run lighthouse` and `npm run audit` need a browser path:
  `CHROME_PATH="C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" npm run audit`.
  No project change is needed; CI and any machine with Chrome work without it.
