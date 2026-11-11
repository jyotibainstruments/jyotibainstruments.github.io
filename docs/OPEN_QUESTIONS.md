# Open questions

Questions for the owner. The site does not wait for answers: anything missing is omitted, or stays behind a flag in `src/config/site.ts` and is not rendered.

## Before launch

1. **WhatsApp number.** The default is `918310272964` (83102 72964, listed at both Belgaum and Hubli). Confirm which number receives WhatsApp. Until then every button uses the default, marked UNCONFIRMED in `site.ts`.
2. **ISO/IEC 17025 / NABL (confirmed and published, with conditions).** NABL CC-3243 (ISO/IEC 17025:2017, calibration, Udyambag Belgaum laboratory) is confirmed: certificate 2025-05-11 to 2029-05-10 and scope annexure last amended 2025-05-30. Published wording is limited to the confirmed scope (mechanical-pressure and civil partial as specified; others none). Accreditation covers the Belgaum laboratory (and site-facility schedule) only; no accreditation wording on Hubli, Pune, Ahmedabad or Repairs, Sales or Spares pages. No NABL logo/symbol graphic. `showIsoClaim` remains `false` (obsolete brochure/letter ISO 2005 lines). Keep NABL data updated on renewal/amendment.
3. **Pune and Ahmedabad.** Only partial addresses were supplied, with no phone numbers. Are these staffed offices? Provide full addresses and phone numbers, or confirm they should stay as address-only listings.
4. **Phone numbers to feature.** Which numbers should be primary in the top bar and footer? Current source: Belgaum 72047 68923 and 83102 72964; Hubli 83102 72964 and 89514 93167.
5. **Name spellings.** Confirm `CosOmeter`, `Fastners & Allied Products`, `Uni-Vtl Precession`, and every customer name against the original documents. The site follows CONTENT.md until corrected. Note: "CosOmeter" currently renders verbatim on `/services/calibration/electro-technical/` (it is in the CONTENT.md instrument list, marked "spelling to confirm"); "SHIMADIN Japan" is kept off the site on the same basis but is a maker name, which is higher-risk.
6. **The five product companies and brand authorisations.** The seed list is Mahr, Mitutoyo, Insize, Baker and WIKA (Mahr and Insize marked `confirmed: true` in data, placed at top; all `published: false`). Confirm the final five. INSIZE and MAHR authorisations are confirmed and published for the stated territory/period (valid till 31 Dec 2026); expired authorisations are auto-hidden at build time (Asia/Kolkata, inclusive). **Action needed:** confirm Mahr and Insize renewals for 2027 and supply updated certificates before/at expiry; confirm the correct MAHR authorization reference number (photographed sideways, reads `MMIPL/DIS/ALY2026/27SE`, not published). Mahr badge shown only where Belgaum/Hubli applies. Never write "authorised"/"official"/"distributor" except as permitted by a confirmed, in-date certificate. Use `PUBLIC_SHOW_DRAFTS=1` during development to preview companies.
7. **Customer logos.** May JIE display customer logos publicly? Provide files and written permission. Until then, text wordmarks only.
8. **Photographs.** Lab, instruments and team photos, with permission and captions. Until then no placeholder captions render: missing images are omitted and the layout is designed around real content. A hero photo at `public/images/hero.*` is picked up automatically.
9. **Catalogue PDFs.** One PDF per published company at `public/catalogues/<slug>.pdf`, plus an optional first-page `<slug>.jpg`. Note any clickable `wa.me` links inside the PDFs.
10. **"2000+ customers."** CONTENT.md allows this as the company's stated claim. Confirm the exact public wording.
11. **GSTIN.** Confirm `29BURPM3795G1ZS` should be displayed publicly.
12. **Dharwad.** There is no office in the source. The plan is a service-area page using the Dharwad customers listed in CONTENT.md. Confirm.
13. **Privacy policy.** Required if analytics is enabled. `PUBLIC_GA_ID` is not set, so no analytics are loaded yet. Provide privacy wording or approval to write a short factual page.
14. **Custom domain.** The site currently targets `https://jyotibainstruments.github.io`. If a custom domain is added later, set `ASTRO_SITE`, add `public/CNAME`, and submit the new sitemap.
15. ~~**Dark logo lettering on crimson.** The supplied `JIE_dark.svg` letters are rose `#BD254C` on crimson `#74092B` (about 1.9:1).~~ **Closed 2026-11-07.** The footer now shows the full-colour light logo on a white rounded plate; the dark variant is no longer used anywhere. No owner action needed.
16. **On-site calibration list.** The on-site page reproduces the instruments named in the letter: surface plates, Trimos, bench centers, CMMs, hardness testers, UTM, FTM, CTM and pressure gauges. Confirm this is still the current on-site scope, and whether bio-medical or civil cube testing can be added.
17. **"Minor repair work is free of charge."** The site publishes this as a standing commitment, exactly as supplied. Confirm it should stay public, since it reads as a price statement.
18. **Catalogue metadata per company.** Once a PDF exists for a brand, supply (a) optional first-page poster as `public/catalogues/<slug>.jpg`, (b) category names with their PDF page numbers for the open-at-page chips in `companies.json`, (c) optional highlights. The viewer and chips are live; they just need real page numbers.

19. **Certificates (published; follow-ups).** Confirmed certificates/recognition are published (`docs/CERTIFICATES_EXTRACTED.md`, `src/data/certificates.json`). Follow-ups: (a) provide upright scan/corrected orientation for MAHR authorization PDF (photo turned 90°, not rotated losslessly here) and page-1 previews for PDF certificates if desired; (b) confirm MAHR reference number `MMIPL/DIS/ALY2026/27SE`; (c) supply Mahr and Insize renewal certificates for 2027; (d) confirm who updates certificates on renewal. Scheduled rebuild runs daily (18:35 UTC / 00:05 IST) so expired items drop off automatically; GitHub pauses scheduled runs after 60 days of repo inactivity. No NABL logo/symbol graphic may be used. `inbox/certificates/` holds originals and must not be committed.

## Not supplied, so not displayed

- Founding year, years in business, team size, ownership or staff bios.
- Opening hours.
- Website or social accounts.
- Product codes or ranges for FCDM, Octagon LMM 300 and Torque Master.
- Testimonials or case studies.
- Prices, turnaround times or warranty terms.
- Confirmed/verified certificate, award and authorisation details for public display (see items 2, 6, 19).
