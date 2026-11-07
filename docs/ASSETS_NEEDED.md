# Assets needed

The site never renders "to be supplied"-style captions. Where an image is missing, the slot is redesigned around real content (for example the home hero's quick-contact card and the neutral catalogue cover). Do not use stock-photo hotlinks or invented logos. A hero photo dropped in at `public/images/hero.(avif|webp|jpg|jpeg|png)` is picked up automatically at build time.

## Photographs (from JIE, with permission)

- [ ] Hero photograph: lab, instrument or team image, landscape, at least 2000px wide.
- [ ] Calibration lab interior, Belgaum.
- [ ] Instruments: pressure gauge, vernier/micrometer, torque wrench, temperature calibrator.
- [ ] On-site calibration visit.
- [ ] Team at work (no names required; captions will stay generic).
- [ ] Workshop / repair bench.
- [ ] Civil testing equipment (UTM/CTM or cube testing) if available.
- [ ] Medical equipment calibration (pulse oximeter, defibrillator) if available.
- [ ] One image per calibration discipline for the six service pages (mechanical, electro-technical, thermal, fluid and flow, medical, civil); optional, the pages read correctly without them.

For each image: permission to publish, a short caption, and a note on what it shows. Images will be converted to AVIF/WebP with `astro:assets`.

## Brand assets

- [x] Primary logo (supplied 2026-11-06 as `public/Logo/JIE_light.svg`, `JIE_dark.svg` plus PNGs).
- [x] Favicon set (supplied 2026-11-06 in `public/Logo/favicon/`).
- [ ] Confirmation that the favicon gauge mark is the intended icon at 16px; it differs from the full wordmark logo.

## Brand logos (with permission)

- [ ] Mahr
- [ ] Mitutoyo
- [ ] Insize
- [ ] Baker
- [ ] WIKA
- [ ] Any other brand to be listed (Markvel, Mass, Kains, Crystal, Luthra, Britool, Micro, SHRIJI, Reliable, Shimaden)

Prefer SVG; otherwise a transparent PNG at least 400px wide.

## Customer logos (with written permission)

- [ ] The featured clients named in CONTENT.md section 7.
- [ ] Any additional client logo the owner wants displayed.

Until permission and files arrive, the site shows text wordmarks.

## Catalogues

- [ ] `public/catalogues/mahr.pdf`
- [ ] `public/catalogues/mitutoyo.pdf`
- [ ] `public/catalogues/insize.pdf`
- [ ] `public/catalogues/baker.pdf`
- [ ] `public/catalogues/wika.pdf`
- [ ] Optional first-page posters: `public/catalogues/<slug>.jpg`

The owner supplies the PDFs. The site builds the viewer and facade.

## Other

- [ ] ISO/IEC 17025 certificate scan, if the claim is to be shown (see `OPEN_QUESTIONS.md`).
- [ ] Privacy policy wording, if analytics is enabled.
- [ ] Product photographs for the four highlighted products, if available.
