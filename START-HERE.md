# How to use this kit with OpenCode

Delete this file once the project is running. The agent writes the real `README.md` in Phase 7.

## Setup (10 minutes)

1. Create a new GitHub repository (a user site named `<username>.github.io`, or any project repo). Put everything from this kit in the repo root, keeping the hidden `.opencode/` folder.
2. In that folder run `git init`, then `git add -A && git commit -m "Add project brief"`.
3. Install OpenCode (see https://opencode.ai/docs/) and start it inside the folder with `opencode`. Connect a provider and choose a strong coding model.
4. **Do not run `/init`.** `AGENTS.md` is already written and `/init` would rewrite it.
5. Check the agent has loaded the rules: ask "Summarise the content integrity rules in AGENTS.md" and confirm it mentions never inventing facts and never writing NABL.

## Building

Run the phases in order, one per session, committing after each:

```
/phase 1    foundation, tokens, layout, deploy workflow
/phase 2    header, footer, nav dropdowns, shared components, data files
/phase 3    home page
/phase 4    services pages
/phase 5    products, catalogue viewer
/phase 6    clients, about, contact, locations, privacy
/phase 7    polish, audit, README
```
After phases 3, 5 and 7 run `/audit`. Review the site locally (`npm run dev`) before approving the next phase.

## Things only you can supply

- Catalogue PDFs: `public/catalogues/<company>.pdf`, plus an optional first-page image `<company>.jpg`. Then set that company's `published` to `true` in `src/data/companies.json`.
- Confirmation of the five companies (the kit seeds Mahr, Mitutoyo, Insize, Baker, WIKA as candidates).
- The WhatsApp number (the kit defaults to 83102 72964) and which phone numbers to show.
- Logo files for brands and customers (with permission to display them), and photographs of the lab, instruments and team.
- Answers to the items in `docs/OPEN_QUESTIONS.md` as the agent adds them, especially the ISO/IEC 17025 wording and certificate, the founding year, and whether Pune and Ahmedabad are staffed offices.

## Going live

Repository Settings, Pages, Source: **GitHub Actions**. Push to `main` and the included workflow deploys. For a custom domain, add `public/CNAME`, set the `ASTRO_SITE` variable to the domain, then add the site in Google Search Console and submit `sitemap-index.xml`.
