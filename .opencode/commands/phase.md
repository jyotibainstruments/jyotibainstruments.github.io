---
description: Run one build phase from docs/PHASES.md
---

Execute **Phase $1** only.

Read these first, in full:
@AGENTS.md
@docs/BRIEF.md
@docs/PHASES.md

Current repo state:
!`git status --short | head -40`
!`ls -1 src src/pages src/components 2>/dev/null | head -80`

Rules for this run:
1. Do only the tasks listed under Phase $1. If an earlier phase is incomplete or missing, stop and say which.
2. Facts come only from docs/CONTENT.md. Add anything missing to docs/OPEN_QUESTIONS.md and docs/ASSETS_NEEDED.md; never invent it.
3. Before using any Astro, Fontsource, PDF.js or GitHub Actions API, check its current documentation online instead of relying on memory.
4. Finish by running `npm run build` and fixing every error and warning.
5. Reply with: what was built, files changed, open questions added, assets needed, and anything you deviated from (also record deviations in docs/DECISIONS.md). Then stop.
