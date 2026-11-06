---
description: Build, test and review the site against the brief
subtask: true
---

Audit the current state of the site.

@AGENTS.md
@docs/CONTENT.md

1. Run `npm run build`, then `npm run audit`. Report every failure and every Lighthouse score below target (mobile: Performance 95+, Accessibility 100, Best Practices 100, SEO 100).
2. Content integrity check: scan `src/` and `dist/` for phone numbers, emails, GSTIN, addresses, years, percentages, client names, brand names and certification wording. Compare each against docs/CONTENT.md. List anything not present there, any use of "NABL" or "accredited", and any flagged-off claim that renders.
3. Search `dist/` for leftover `TODO`, `lorem`, `example.com`, `localhost`, and for unpublished companies leaking into pages, nav or sitemap.
4. Check metadata: each page has one h1, a unique title of at most 60 characters and a unique description of at most 155 characters, a canonical URL, valid JSON-LD.
5. Ask `@qa-reviewer` to review the five most important templates visually and for accessibility.

Output a table of findings (severity, file or URL, problem, fix). Do not edit files; list fixes only.

Extra scope or focus from the user: $ARGUMENTS
