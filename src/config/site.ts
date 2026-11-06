import { offices, type Office } from '../lib/content';

/**
 * Facts in this file come from docs/CONTENT.md only.
 * Anything marked UNCONFIRMED stays behind a flag below and is not rendered.
 */

export type { Office };

export type ClaimFlag =
  | 'showIsoClaim'
  | 'showFoundingYear'
  | 'showYearsInBusiness'
  | 'showTeamSize'
  | 'showDealerStatus'
  | 'showProductCodes';

/**
 * All unconfirmed claims are off. Flip only after the owner supplies evidence.
 * ISO/IEC 17025: never write "NABL" or "accredited".
 */
export const claims: Record<ClaimFlag, boolean> = {
  showIsoClaim: false,
  showFoundingYear: false,
  showYearsInBusiness: false,
  showTeamSize: false,
  showDealerStatus: false,
  showProductCodes: false,
};

export const site = {
  name: 'Jyotiba Instruments Enterprises',
  shortName: 'JIE',
  descriptor: 'Calibration, Repairs & Sales',
  tagline: 'Precision Instruments. Reliable Calibration. Trusted Service.',
  gstin: '29BURPM3795G1ZS',
  emails: ['mahesh.misal21@gmail.com', 'jyotibainstruments@gmail.com'],
  // UNCONFIRMED: owner must confirm which number receives WhatsApp.
  whatsapp: '918310272964',
  cities: ['Belgaum', 'Hubli', 'Dharwad', 'Pune', 'Ahmedabad'],
  offices,
  claims,
};

export const primaryOffice = offices.find((office) => office.kind === 'lab') ?? offices[0];
export const primaryPhone = primaryOffice.phones.at(0) ?? null;
