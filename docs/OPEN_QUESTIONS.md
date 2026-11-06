# Open questions

Questions for the owner. The site does not wait for answers: anything missing is omitted, or stays behind a flag in `src/config/site.ts` and is not rendered.

## Before launch

1. **WhatsApp number.** The default is `918310272964` (83102 72964, listed at both Belgaum and Hubli). Confirm which number receives WhatsApp. Until then every button uses the default, marked UNCONFIRMED in `site.ts`.
2. **ISO/IEC 17025.** The letter says "ISO/IEC 17025:2005 Certified Lab"; the brochure prints "ISO/IEC 1705:2005". The 2005 edition is obsolete, and no certificate number, accreditation body, scope or validity date was supplied. `showIsoClaim` is `false`, and the site never uses "NABL" or "accredited". Supply a current certificate if the claim should appear.
3. **Pune and Ahmedabad.** Only partial addresses were supplied, with no phone numbers. Are these staffed offices? Provide full addresses and phone numbers, or confirm they should stay as address-only listings.
4. **Phone numbers to feature.** Which numbers should be primary in the top bar and footer? Current source: Belgaum 72047 68923 and 83102 72964; Hubli 83102 72964 and 89514 93167.
5. **Name spellings.** Confirm `CosOmeter`, `SHIMADIN Japan`, `Fastners & Allied Products`, `Uni-Vtl Precession`, and every customer name against the original documents. The site follows CONTENT.md until corrected.
6. **The five product companies.** The seed list is Mahr, Mitutoyo, Insize, Baker and WIKA. Confirm the final five. Also confirm whether JIE is a dealer or authorised distributor for any brand; until then, company pages stay unpublished and wording stays neutral. All five are currently `published: false`, so the Products menu shows only the All products link; set a company to `published: true` when its catalogue and wording are approved. Use `PUBLIC_SHOW_DRAFTS=1` during development to preview them.
7. **Customer logos.** May JIE display customer logos publicly? Provide files and written permission. Until then, text wordmarks only.
8. **Photographs.** Lab, instruments and team photos, with permission and captions. Until then, the `Placeholder` component is used.
9. **Catalogue PDFs.** One PDF per published company at `public/catalogues/<slug>.pdf`, plus an optional first-page `<slug>.jpg`. Note any clickable `wa.me` links inside the PDFs.
10. **"2000+ customers."** CONTENT.md allows this as the company's stated claim. Confirm the exact public wording.
11. **GSTIN.** Confirm `29BURPM3795G1ZS` should be displayed publicly.
12. **Dharwad.** There is no office in the source. The plan is a service-area page using the Dharwad customers listed in CONTENT.md. Confirm.
13. **Privacy policy.** Required if analytics is enabled. `PUBLIC_GA_ID` is not set, so no analytics are loaded yet. Provide privacy wording or approval to write a short factual page.
14. **Custom domain.** The site currently targets `https://jyotibainstruments.github.io`. If a custom domain is added later, set `ASTRO_SITE`, add `public/CNAME`, and submit the new sitemap.
15. **Dark logo lettering on crimson.** The supplied `JIE_dark.svg` letters are rose `#BD254C` on crimson `#74092B` (about 1.9:1). Logos are exempt from WCAG text contrast, but the wordmark reads faintly in the footer. Approve this variant as-is, or supply a footer variant with white or `#F0C45A` lettering.
16. **On-site calibration list.** The on-site page reproduces the instruments named in the letter: surface plates, Trimos, bench centers, CMMs, hardness testers, UTM, FTM, CTM and pressure gauges. Confirm this is still the current on-site scope, and whether bio-medical or civil cube testing can be added.
17. **"Minor repair work is free of charge."** The site publishes this as a standing commitment, exactly as supplied. Confirm it should stay public, since it reads as a price statement.
18. **Catalogue metadata per company.** Once a PDF exists for a brand, supply (a) optional first-page poster as `public/catalogues/<slug>.jpg`, (b) category names with their PDF page numbers for the open-at-page chips in `companies.json`, (c) optional highlights. The viewer and chips are live; they just need real page numbers.

## Not supplied, so not displayed

- Founding year, years in business, team size, ownership or staff bios.
- Opening hours.
- Website or social accounts.
- Product codes or ranges for FCDM, Octagon LMM 300 and Torque Master.
- Certificates, awards, testimonials or case studies.
- Prices, turnaround times or warranty terms.
