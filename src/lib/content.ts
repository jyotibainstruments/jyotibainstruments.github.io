import { z } from 'zod';
import officesJson from '../data/offices.json';
import companiesJson from '../data/companies.json';
import clientsJson from '../data/clients.json';
import servicesJson from '../data/services.json';
import processJson from '../data/process.json';

/**
 * Validates a JSON collection and fails the build with a readable list of
 * problems instead of a raw Zod stack trace.
 */
function parseCollection<S extends z.ZodType>(name: string, schema: S, data: unknown): z.infer<S> {
  const result = schema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  - ${issue.path.join('.') || '(root)'}: ${issue.message}`)
      .join('\n');
    throw new Error(`Invalid ${name} data:\n${issues}`);
  }
  return result.data;
}

function hasUniqueValues(values: string[]): boolean {
  return new Set(values).size === values.length;
}

/* Offices */

const phoneSchema = z
  .string()
  .regex(/^\d{5} \d{5}$/, 'Expected a 10-digit mobile number formatted as "00000 00000"');

const addressPartsSchema = z.object({
  streetAddress: z.string().min(1),
  addressLocality: z.string().min(1),
  postalCode: z.string().min(1),
  addressRegion: z.string().min(1),
  addressCountry: z.string().length(2),
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

export type Office = z.infer<typeof officeSchema>;

export const offices = parseCollection(
  'offices',
  z
    .array(officeSchema)
    .min(1)
    .refine((items) => hasUniqueValues(items.map((item) => item.slug)), {
      message: 'Office slugs must be unique',
    }),
  officesJson,
);

/* Companies */

const companySchema = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, digits and single hyphens'),
  name: z.string().min(1),
  logo: z.string().min(1).nullable().default(null),
  intro: z.string().min(1).nullable().default(null),
  pdf: z.string().min(1).nullable().default(null),
  categories: z
    .array(
      z.object({
        name: z.string().min(1),
        page: z.number().int().positive(),
      }),
    )
    .default([]),
  highlights: z
    .array(
      z.object({
        name: z.string().min(1),
        code: z.string().min(1).optional(),
      }),
    )
    .default([]),
  published: z.boolean(),
});

export type Company = z.infer<typeof companySchema>;

export const companies = parseCollection(
  'companies',
  z
    .array(companySchema)
    .refine((items) => hasUniqueValues(items.map((item) => item.slug)), {
      message: 'Company slugs must be unique',
    })
    .superRefine((items, ctx) => {
      items.forEach((item, index) => {
        if (item.pdf !== null && item.pdf !== `/catalogues/${item.slug}.pdf`) {
          ctx.addIssue({
            code: 'custom',
            path: [index, 'pdf'],
            message: `PDF must be "/catalogues/${item.slug}.pdf"`,
          });
        }
      });
    }),
  companiesJson,
);

/* Clients */

export const clientSectors = [
  'Cement and construction',
  'Hydraulics, valves, pumps and flow',
  'Automotive and engineering',
  'Power and railways',
  'Medical and healthcare',
  'Government and forensic',
  'Logistics',
] as const;

const clientSchema = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, digits and single hyphens'),
  name: z.string().min(1),
  location: z.string().min(1),
  sector: z.enum(clientSectors),
  featured: z.boolean().default(false),
  city: z.enum(['belgaum', 'hubli', 'dharwad']).nullable().default(null),
  logo: z.string().min(1).nullable().default(null),
});

export type Client = z.infer<typeof clientSchema>;

export const clients = parseCollection(
  'clients',
  z
    .array(clientSchema)
    .refine((items) => hasUniqueValues(items.map((item) => item.slug)), {
      message: 'Client slugs must be unique',
    }),
  clientsJson,
);

/* Services */

const faqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

const serviceSchema = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, digits and single hyphens'),
  path: z
    .string()
    .regex(/^\/services\/(?:[a-z0-9-]+\/){1,2}$/, 'Expected a path under /services/ with a trailing slash'),
  title: z.string().min(1),
  navTitle: z.string().min(1),
  kind: z.enum(['overview', 'discipline', 'service']),
  parent: z.string().nullable().default(null),
  order: z.number().int().nonnegative(),
  summary: z.string().min(1),
  examples: z.array(z.string().min(1)).default([]),
  instruments: z.array(z.string().min(1)).default([]),
  faq: z.array(faqSchema).default([]),
});

export type Service = z.infer<typeof serviceSchema>;
export type ServiceFaq = z.infer<typeof faqSchema>;

const services = parseCollection(
  'services',
  z
    .array(serviceSchema)
    .min(1)
    .refine((items) => hasUniqueValues(items.map((item) => item.slug)), {
      message: 'Service slugs must be unique',
    })
    .refine((items) => hasUniqueValues(items.map((item) => item.path)), {
      message: 'Service paths must be unique',
    })
    .superRefine((items, ctx) => {
      if (items.filter((item) => item.kind === 'overview').length !== 1) {
        ctx.addIssue({ code: 'custom', message: 'Exactly one service must have kind "overview"' });
      }

      items.forEach((item, index) => {
        if (item.kind === 'discipline' && item.parent !== 'calibration') {
          ctx.addIssue({
            code: 'custom',
            path: [index, 'parent'],
            message: 'Disciplines must set parent to "calibration"',
          });
        }

        if (item.kind !== 'discipline' && item.parent !== null) {
          ctx.addIssue({
            code: 'custom',
            path: [index, 'parent'],
            message: 'Only disciplines may set a parent',
          });
        }

        const expectedPath =
          item.kind === 'overview'
            ? '/services/calibration/'
            : item.kind === 'discipline'
              ? `/services/calibration/${item.slug}/`
              : `/services/${item.slug}/`;

        if (item.path !== expectedPath) {
          ctx.addIssue({
            code: 'custom',
            path: [index, 'path'],
            message: `Expected "${expectedPath}" for this service`,
          });
        }
      });
    }),
  servicesJson,
);

export { services };

/** Services in display order. */
export const orderedServices = [...services].sort((a, b) => a.order - b.order);

export const calibrationOverview = orderedServices.find((service) => service.kind === 'overview');

export const calibrationDisciplines = orderedServices.filter(
  (service) => service.kind === 'discipline',
);

export const otherServices = orderedServices.filter((service) => service.kind === 'service');

/* Process */

const processStepSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

export type ProcessStep = z.infer<typeof processStepSchema>;

export const processSteps = parseCollection(
  'process',
  z.array(processStepSchema).min(1),
  processJson,
);

/* Derived views */

/**
 * Set PUBLIC_SHOW_DRAFTS=1 to see unpublished companies during development.
 * A production build only includes companies the owner has published.
 */
export const showDrafts = import.meta.env.PUBLIC_SHOW_DRAFTS === '1';

export const visibleCompanies = companies.filter((company) => showDrafts || company.published);

export const featuredClients = clients.filter((client) => client.featured);

export const clientsBySector = clientSectors
  .map((sector) => ({
    sector,
    clients: clients.filter((client) => client.sector === sector),
  }))
  .filter((group) => group.clients.length > 0);

export function clientsInCity(city: 'belgaum' | 'hubli' | 'dharwad'): Client[] {
  return clients.filter((client) => client.city === city);
}

export function companyPath(slug: string): string {
  return `/products/${slug}/`;
}
