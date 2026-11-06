import { z } from 'zod';
import officesJson from '../data/offices.json';

/**
 * Facts in this file come from docs/CONTENT.md only.
 * Anything marked UNCONFIRMED stays behind a flag below and is not rendered.
 */

const phoneSchema = z
  .string()
  .regex(/^\d{5} \d{5}$/, 'Expected a 10-digit mobile number formatted as "00000 00000"');

const addressPartsSchema = z.object({
  streetAddress: z.string().min(1),
  addressLocality: z.string().min(1),
  postalCode: z.string().min(1),
  addressRegion: z.string().min(1),
  addressCountry: z.string().min(2).max(2),
});

const officeSchema = z.object({
  slug: z.enum(['belgaum', 'hubli', 'pune', 'ahmedabad']),
  name: z.string().min(1),
  shortName: z.string().min(1),
  kind: z.enum(['lab', 'branch', 'office']),
  address: z.string().min(1),
  phones: z.array(phoneSchema),
  mapQuery: z.string().min(1).nullable(),
  addressParts: addressPartsSchema.nullable(),
});

const offices = z
  .array(officeSchema)
  .min(1)
  .refine((items) => new Set(items.map((item) => item.slug)).size === items.length, {
    message: 'Office slugs must be unique',
  })
  .parse(officesJson);

export type Office = z.infer<typeof officeSchema>;

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
