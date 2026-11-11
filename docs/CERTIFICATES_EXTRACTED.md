# Certificates: confirmed facts (from source documents)

**Status:** confirmed from the documents supplied/read (owner-confirmed pass, 2026-11-11). Values below are the source of truth for `src/data/certificates.json` and published wording. Dates on NABL documents are DD/MM/YYYY; ISO dates stored in data.
**Method note:** earlier text extraction was partial for NABL/INSIZE and unreadable for MAHR/JPEGs in this environment; this document now records the confirmed printed facts provided by the owner after reading the files by eye.

## Sanity check
- `BelEX2026.jpeg`: 960×1280 px (portrait, ~3:4). OK.
- `best_debutant_dealer.jpeg`: 3024×4032 px (portrait, ~3:4). OK.

## 1. NABL Certificate of Accreditation (`nabl-certificate-of-accreditation`, accreditation)

- **Issuer:** National Accreditation Board for Testing and Calibration Laboratories (NABL)
- **Number:** CC-3243
- **Issued:** 2025-05-11 (11/05/2025)
- **Valid until:** 2029-05-10 (10/05/2029)
- **Holder as printed:** `JYOTIBA INSTRUMENTS ENTERPRISES`
- **Facility:** `SHREE COMPLEX, BLOCK NO. 7, 1ST FLOOR, PLOT NO. 182/A & 186, SR. NO. 347/1B, UDYAMBAG, BELGAUM, BELAGAVI`
- **Field:** CALIBRATION
- **Standard:** ISO/IEC 17025:2017 "General Requirements for the Competence of Testing & Calibration Laboratories"
- **Printed wording (key):** "assessed and accredited in accordance with the standard ISO/IEC 17025:2017 'General Requirements for the Competence of Testing & Calibration Laboratories' for its facilities at ..." "in the field of CALIBRATION". "valid for the Scope of Accreditation as specified in the annexure".
- **Signatories:** Anita Rani (Director), N. Venkateswaran (Chief Executive Officer)
- **Pages:** 1
- **Public file:** `/certificates/jie-nabl-certificate-of-accreditation.pdf`

## 2. NABL Scope of Accreditation (`nabl-scope-of-accreditation`, scope)

- **Issuer:** NABL
- **Number:** CC-3243 (annexure)
- **Issued/validity:** 2025-05-11 to 2029-05-10
- **Last amended:** 2025-05-30 (30/05/2025)
- **Holder/laboratory:** `JYOTIBA INSTRUMENTS ENTERPRISES`
- **Pages:** 20
- **Structure:** Permanent Facility entries 1 to 94 (pages 1 to 16); Site Facility entries 1 to 20 (pages 17 to 20).
- **Headings as printed:** MECHANICAL-DIMENSION (BASIC MEASURING INSTRUMENT, GAUGE ETC.), MECHANICAL-DIMENSION (PRECISION INSTRUMENTS), MECHANICAL-PRESSURE INDICATING DEVICES, and at site facility only MECHANICAL-HARDNESS TESTING MACHINES (Brinell, Rockwell, Vickers). No electrical, thermal, flow, medical, force, torque or mass.
- **Confirmed NABL per-discipline scope mapping:**
  - `mechanical-pressure`: **partial** — gauges and dimensional instruments (micrometers, vernier and dial calipers, bore, snap, plug, ring and thread gauges, height gauges, profile projectors), pressure and vacuum gauges (0 to 1000 bar hydraulic, 0 to 40 bar pneumatic, minus 0.80 bar to 0), and on site hardness testers. Nothing else accredited.
  - `civil`: **partial** — civil-lab items inside the dimensional schedule only: slump cone, moulds (cube, beam), flakiness and elongation gauge, core cutter, test sieves. Not compression testing machines or anything else.
  - `electro-technical`: **none**
  - `thermal`: **none**
  - `fluid-flow`: **none**
  - `medical`: **none**
- **Public file:** `/certificates/jie-nabl-scope-of-accreditation.pdf`

## 3. MAHR Authorization Certificate (`mahr-authorization-certificate`, authorisation)

- **Issuer:** Mahr Metrology India Pvt. Ltd.
- **Number/Ref:** `MMIPL/DIS/ALY2026/27SE` (read from photo, sideways; published per owner request)
- **Issued:** 2026-01-01 (01st January 2026, India)
- **Valid until:** 2026-12-31 (Valid Till: December 31, 2026)
- **Holder as printed:** `Jyotiba Instruments Enterprises`
- **Quote:** "is hereby authorized to sell and distribute Mahr manufactured products as detailed below in Belgaum & Hubli."
- **Product lines:** Mahr Dimensional Metrology Products; Mahr Rotary Stroke Bearing
- **Territory:** Belgaum & Hubli
- **Signatory:** Deepayan Das, Managing Director, Mahr Metrology India Pvt. Ltd.
- **Notes:** Marked "Non-Transferable". Source PDF is a photograph of the framed certificate, turned 90 degrees; no lossless rotate tool available in this environment (kept as-is, see ASSETS_NEEDED/DECISIONS).
- **Pages:** 1
- **Public file:** `/certificates/jie-mahr-authorization-certificate.pdf`

## 4. INSIZE Authorized Dealer (`insize-authorized-dealer`, authorisation)

- **Issuer:** INSIZE CO., LTD.
- **Number:** none
- **Issued/authorization date:** 2026-01-01 (Jan. 1st, 2026)
- **Valid until:** 2026-12-31 (valid till Dec. 31st, 2026)
- **Holder as printed:** `Jyotiba Instruments Enterprises.`
- **Quote:** "is the authorized dealer of INSIZE CO., LTD. in India"
- **Territory:** India
- **Signatory:** Managing Director (no name legibly printed)
- **Pages:** 1
- **Public file:** `/certificates/jie-insize-authorized-dealer.pdf`

## 5. Best Debutant Dealer 2025 (`mahr-best-debutant-dealer`, award)

- **Source:** `best_debutant_dealer.jpeg` → `src/assets/certificates/mahr-best-debutant-dealer-2025.jpeg`
- **Issuer:** Mahr Metrology India Pvt. Ltd.
- **Recipient:** Jyotiba Instruments Enterprises
- **Year:** 2025
- **Quote/text:** "In recognition of outstanding performance / BEST DEBUTANT DEALER / for the year 2025 / Presented to Jyotiba Instruments Enterprises" (spelling "DEBUTANT" preserved)
- **Number/dates:** none
- **Recognition text for site:** "Best Debutant Dealer 2025, Mahr Metrology India Pvt. Ltd."

## 6. BelEx 2026 appreciation (`belex-2026-appreciation`, event)

- **Source:** `BelEX2026.jpeg` → `src/assets/certificates/belex-2026-appreciation.jpeg`
- **Issuer:** The Belgaum Chamber of Commerce & Industries, Belagavi
- **Recipient named on item:** none (not an award/prize; does not name JIE)
- **Event:** BelEx 2026, 24, 25 & 26 March 2026
- **Venue:** Belgaum Foundry Cluster, Udyambag, Belagavi
- **Quote/text:** "We appreciate your Support to BelEx 2026"
- **Recognition text for site:** "Appreciation memento for support to BelEx 2026, The Belgaum Chamber of Commerce & Industries (24 to 26 March 2026)"
- **Do not:** write "award", "winner" or "exhibitor"; do not list sponsors/other companies on it.

## Wording/placement rules (applied)

- NABL: "Calibration accredited by NABL for the scope listed" (home chip/Why JIE). `/certificates/` intro as specified. Accreditation covers Belgaum laboratory (and site-facility schedule) only; no accreditation wording on Hubli, Pune, Ahmedabad or Repairs, Sales or Spares pages. No NABL logo/symbol graphic.
- Mahr: "Authorised by Mahr Metrology India Pvt. Ltd. to sell and distribute Mahr Dimensional Metrology Products and Mahr Rotary Stroke Bearing in Belgaum and Hubli. Valid till 31 December 2026." Only where Belgaum/Hubli applies; never on Dharwad/Pune/Ahmedabad pages.
- Insize: "Authorised dealer of INSIZE CO., LTD. in India. Valid till 31 December 2026."
- Do not improvise: no "NABL accredited calibration laboratory" without scope qualifier, no "NABL certified", no "ISO 17025 certified", no "award-winning", no "official partner".

## Still held back / notes

- **MAHR Ref. No. `MMIPL/DIS/ALY2026/27SE`:** published per owner request (“release all held back works”). Read from a sideways photo; confirm if a clearer reference differs.
- **MAHR PDF orientation:** rotated view not applied (no `qpdf`/`mutool`/`pypdf` available). File kept byte-identical; neutral cover shown for PDF card; upright scan requested in `docs/ASSETS_NEEDED.md`.
- **PDF previews:** page-1 previews not generated (no Playwright/Chromium rasterization path executed here); neutral covers used.
- **Expiry:** Mahr and Insize authorisations expire 2026-12-31; auto-hidden after expiry (Asia/Kolkata, inclusive) with warning; `check-certificates` warns within 60 days (expected now, exit 0).
