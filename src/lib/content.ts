import { z } from 'zod';
import officesJson from '../data/offices.json';
import companiesJson from '../data/companies.json';
import clientsJson from '../data/clients.json';
import servicesJson from '../data/services.json';
import processJson from '../data/process.json';
import homeJson from '../data/home.json';
import servicesPageJson from '../data/services-page.json';
import productsPageJson from '../data/products-page.json';
import clientsPageJson from '../data/clients-page.json';
import aboutPageJson from '../data/about-page.json';
import contactPageJson from '../data/contact-page.json';
import locationsJson from '../data/locations.json';
import privacyPageJson from '../data/privacy-page.json';
import notFoundJson from '../data/not-found.json';
import certificatesJson from '../data/certificates.json';

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
  confirmed: z.boolean().default(false),
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

const serviceNoteSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
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
  heading: z.string().min(1),
  metaTitle: z.string().min(1).max(60, 'Meta titles must be 60 characters or fewer'),
  metaDescription: z
    .string()
    .min(1)
    .max(155, 'Meta descriptions must be 155 characters or fewer'),
  kind: z.enum(['overview', 'discipline', 'service']),
  parent: z.string().nullable().default(null),
  order: z.number().int().nonnegative(),
  summary: z.string().min(1),
  intro: z.array(z.string().min(1)).min(1).max(3),
  listTitle: z.string().min(1),
  examples: z.array(z.string().min(1)).default([]),
  instruments: z.array(z.string().min(1)).default([]),
  notes: z.array(serviceNoteSchema).default([]),
  onSiteNote: z.string().min(1).nullable().default(null),
  related: z.array(z.string().min(1)).default([]),
  faq: z.array(faqSchema).min(3).max(5),
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

        item.related.forEach((slug, relatedIndex) => {
          if (slug === item.slug) {
            ctx.addIssue({
              code: 'custom',
              path: [index, 'related', relatedIndex],
              message: 'A service cannot link to itself',
            });
          } else if (!items.some((other) => other.slug === slug)) {
            ctx.addIssue({
              code: 'custom',
              path: [index, 'related', relatedIndex],
              message: `Unknown service slug "${slug}"`,
            });
          }
        });

        if (!hasUniqueValues(item.related)) {
          ctx.addIssue({
            code: 'custom',
            path: [index, 'related'],
            message: 'Related service slugs must be unique',
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

export const servicesBySlug = new Map(services.map((service) => [service.slug, service]));

export function getService(slug: string): Service {
  const service = servicesBySlug.get(slug);
  if (!service) {
    throw new Error(`Unknown service slug "${slug}"`);
  }
  return service;
}

export function relatedServices(service: Service): Service[] {
  return service.related.map((slug) => getService(slug));
}

/* Services hub */

const servicesPageSchema = z.object({
  heading: z.string().min(1),
  metaTitle: z.string().min(1).max(60, 'Meta titles must be 60 characters or fewer'),
  metaDescription: z.string().min(1).max(155, 'Meta descriptions must be 155 characters or fewer'),
  intro: z.array(z.string().min(1)).min(1).max(3),
  faq: z.array(faqSchema).min(3).max(5),
});

export type ServicesPage = z.infer<typeof servicesPageSchema>;

export const servicesPage = parseCollection('services page', servicesPageSchema, servicesPageJson);

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

/* Home */

const homeSectionSchema = z.object({
  title: z.string().min(1),
  intro: z.string().min(1),
});

const homeItemSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

const homeSchema = z.object({
  hero: z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    summary: z.string().min(1),
    chips: z.array(z.string().min(1)).min(1),
  }),
  services: homeSectionSchema,
  products: homeSectionSchema,
  disciplines: homeSectionSchema,
  onSite: z.object({
    title: z.string().min(1),
    summary: z.string().min(1),
    points: z.array(z.string().min(1)).min(1),
  }),
  process: homeSectionSchema,
  why: homeSectionSchema.extend({ items: z.array(homeItemSchema).min(1) }),
  clients: homeSectionSchema,
  locations: homeSectionSchema,
  cta: z.object({
    title: z.string().min(1),
    summary: z.string().min(1),
  }),
});

export type HomeContent = z.infer<typeof homeSchema>;

export const home = parseCollection('home', homeSchema, homeJson);

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

/* Products hub */

const productsPageSchema = z.object({
  heading: z.string().min(1),
  metaTitle: z.string().min(1).max(60, 'Meta titles must be 60 characters or fewer'),
  metaDescription: z.string().min(1).max(155, 'Meta descriptions must be 155 characters or fewer'),
  intro: z.array(z.string().min(1)).min(1).max(3),
});

export type ProductsPage = z.infer<typeof productsPageSchema>;

export const productsPage = parseCollection('products page', productsPageSchema, productsPageJson);

/* Clients page */

const clientsPageSchema = z.object({
  heading: z.string().min(1),
  metaTitle: z.string().min(1).max(60, 'Meta titles must be 60 characters or fewer'),
  metaDescription: z.string().min(1).max(155, 'Meta descriptions must be 155 characters or fewer'),
  intro: z.array(z.string().min(1)).min(1).max(3),
  featuredLabel: z.string().min(1),
});

export type ClientsPage = z.infer<typeof clientsPageSchema>;

export const clientsPage = parseCollection('clients page', clientsPageSchema, clientsPageJson);

/* About page */

const aboutPageSchema = z.object({
  heading: z.string().min(1),
  metaTitle: z.string().min(1).max(60, 'Meta titles must be 60 characters or fewer'),
  metaDescription: z.string().min(1).max(155, 'Meta descriptions must be 155 characters or fewer'),
  intro: z.array(z.string().min(1)).min(1).max(3),
  whatWeDo: z.object({
    title: z.string().min(1),
    paragraph: z.string().min(1),
    activities: z.array(z.string().min(1)).min(1),
    audiences: z.object({
      title: z.string().min(1),
      paragraph: z.string().min(1),
    }),
  }),
  principles: z.object({
    title: z.string().min(1),
    paragraph: z.string().min(1),
    items: z
      .array(
        z.object({
          title: z.string().min(1),
          body: z.string().min(1),
        }),
      )
      .min(1),
  }),
  strengths: z.object({
    title: z.string().min(1),
    items: z.array(z.string().min(1)).min(1),
  }),
  processTitle: z.string().min(1),
  processIntro: z.string().min(1),
  placesTitle: z.string().min(1),
  placesNote: z.string().min(1),
});

export type AboutPage = z.infer<typeof aboutPageSchema>;

export const aboutPage = parseCollection('about page', aboutPageSchema, aboutPageJson);

/* Contact page */

const contactPageSchema = z.object({
  heading: z.string().min(1),
  metaTitle: z.string().min(1).max(60, 'Meta titles must be 60 characters or fewer'),
  metaDescription: z.string().min(1).max(155, 'Meta descriptions must be 155 characters or fewer'),
  intro: z.array(z.string().min(1)).min(1).max(3),
  officesTitle: z.string().min(1),
  officesIntro: z.string().min(1),
  statedOnlyLabel: z.string().min(1),
  statedOnlyNote: z.string().min(1),
  emailsTitle: z.string().min(1),
  gstinTitle: z.string().min(1),
  gstinNote: z.string().min(1),
  mapsText: z.string().min(1),
  whatsappTitle: z.string().min(1),
  whatsappText: z.string().min(1),
  serviceMessage: z.string().min(1),
  closingTitle: z.string().min(1),
  closingText: z.string().min(1),
  locationsLink: z.string().min(1),
});

export type ContactPage = z.infer<typeof contactPageSchema>;

export const contactPage = parseCollection('contact page', contactPageSchema, contactPageJson);

/* Locations */

const narrativeSchema = z.array(z.string().min(1)).min(4).superRefine((paragraphs, ctx) => {
  const wordCount = paragraphs
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length;
  if (wordCount < 250) {
    ctx.addIssue({
      code: 'custom',
      message: `Location narrative needs 250+ words of unique copy (found ${wordCount})`,
    });
  }
});

const locationCitySchema = z.object({
  slug: z.enum(['belgaum', 'hubli', 'dharwad']),
  serviceArea: z.boolean(),
  heading: z.string().min(1),
  metaTitle: z.string().min(1).max(60, 'Meta titles must be 60 characters or fewer'),
  metaDescription: z.string().min(1).max(155, 'Meta descriptions must be 155 characters or fewer'),
  narrative: narrativeSchema,
});

const locationsSchema = z.object({
  heading: z.string().min(1),
  metaTitle: z.string().min(1).max(60, 'Meta titles must be 60 characters or fewer'),
  metaDescription: z.string().min(1).max(155, 'Meta descriptions must be 155 characters or fewer'),
  intro: z.array(z.string().min(1)).min(1).max(3),
  detailsLabel: z.string().min(1),
  serviceAreaLabel: z.string().min(1),
  realOfficeLabel: z.string().min(1),
  statedOnlyLabel: z.string().min(1),
  statedOnlyNote: z.string().min(1),
  cities: z
    .array(locationCitySchema)
    .refine((cities) => hasUniqueValues(cities.map((city) => city.slug)), {
      message: 'City slugs must be unique',
    }),
});

export type LocationCity = z.infer<typeof locationCitySchema>;
export type LocationsContent = z.infer<typeof locationsSchema>;

export const locationsContent = parseCollection('locations', locationsSchema, locationsJson);

export const locationCities = locationsContent.cities;

export function getLocationCity(slug: string): LocationCity {
  const city = locationCities.find((entry) => entry.slug === slug);
  if (!city) {
    throw new Error(`Unknown location city "${slug}"`);
  }
  return city;
}

export function getOffice(slug: string): Office | undefined {
  return offices.find((office) => office.slug === slug);
}

/* Privacy page */

const privacyPageSchema = z.object({
  heading: z.string().min(1),
  metaTitle: z.string().min(1).max(60, 'Meta titles must be 60 characters or fewer'),
  metaDescription: z.string().min(1).max(155, 'Meta descriptions must be 155 characters or fewer'),
  intro: z.array(z.string().min(1)).min(1).max(3),
  items: z
    .array(
      z.object({
        title: z.string().min(1),
        body: z.array(z.string().min(1)).min(1),
      }),
    )
    .min(1),
});

export type PrivacyPage = z.infer<typeof privacyPageSchema>;

export const privacyPage = parseCollection('privacy page', privacyPageSchema, privacyPageJson);

/* 404 page */

const notFoundSchema = z.object({
  heading: z.string().min(1),
  metaTitle: z.string().min(1).max(60, 'Meta titles must be 60 characters or fewer'),
  metaDescription: z.string().min(1).max(155, 'Meta descriptions must be 155 characters or fewer'),
  text: z.string().min(1),
  quickLinks: z.object({
    title: z.string().min(1),
    items: z
      .array(
        z.object({
          label: z.string().min(1),
          path: z.string().regex(/^\/(?:[a-z0-9-]+\/)*$/),
        }),
      )
      .min(1),
  }),
  whatsappTitle: z.string().min(1),
  whatsappText: z.string().min(1),
  serviceMessage: z.string().min(1),
});

export type NotFoundPage = z.infer<typeof notFoundSchema>;

export const notFoundPage = parseCollection('not-found page', notFoundSchema, notFoundJson);

/* Certificates */

export const certificateDisciplines = [
  'mechanical-pressure',
  'electro-technical',
  'thermal',
  'fluid-flow',
  'medical',
  'civil',
] as const;

const disciplineScopeSchema = z.enum(['full', 'partial', 'none']);

const disciplineScopesSchema = z.object({
  'mechanical-pressure': disciplineScopeSchema,
  'electro-technical': disciplineScopeSchema,
  thermal: disciplineScopeSchema,
  'fluid-flow': disciplineScopeSchema,
  medical: disciplineScopeSchema,
  civil: disciplineScopeSchema,
});

const isoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const certificateSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, digits and single hyphens'),
  kind: z.enum(['accreditation', 'scope', 'authorisation', 'award', 'event']),
  title: z.string().min(1),
  issuer: z.string().min(1),
  holderAsPrinted: z.string().min(1).nullable().default(null),
  number: z.string().min(1).nullable().default(null),
  issued: isoDateSchema.nullable().default(null),
  validUntil: isoDateSchema.nullable().default(null),
  lastAmended: isoDateSchema.nullable().default(null),
  summary: z.string().min(1),
  brand: z.string().min(1).nullable().default(null),
  file: z.string().min(1),
  preview: z.string().min(1).nullable().default(null),
  pages: z.number().int().positive(),
  alt: z.string().min(1),
  verified: z.boolean(),
  order: z.number().int().nonnegative(),
  disciplineScopes: disciplineScopesSchema.nullable().default(null),
  territory: z.string().min(1).nullable().default(null),
  productLines: z.array(z.string().min(1)).default([]),
  quote: z.string().min(1).nullable().default(null),
  signatory: z.string().min(1).nullable().default(null),
  eventDates: z.string().min(1).nullable().default(null),
  venue: z.string().min(1).nullable().default(null),
  embedUrl: z.string().url().nullable().default(null),
});

export type Certificate = z.infer<typeof certificateSchema>;
export type CertificateDiscipline = (typeof certificateDisciplines)[number];
export type DisciplineScope = z.infer<typeof disciplineScopeSchema>;

export const certificates = parseCollection(
  'certificates',
  z
    .array(certificateSchema)
    .refine((items) => hasUniqueValues(items.map((item) => item.id)), {
      message: 'Certificate ids must be unique',
    })
    .superRefine((items, ctx) => {
      items.forEach((item, index) => {
        if (item.kind !== 'event' && !item.holderAsPrinted) {
          ctx.addIssue({
            code: 'custom',
            path: [index, 'holderAsPrinted'],
            message: 'holderAsPrinted is required except for event certificates',
          });
        }
        if (item.kind === 'authorisation' && !item.brand) {
          ctx.addIssue({
            code: 'custom',
            path: [index, 'brand'],
            message: 'Authorisation certificates must set a brand slug',
          });
        }
        if ((item.kind === 'accreditation' || item.kind === 'scope') && !item.disciplineScopes) {
          ctx.addIssue({
            code: 'custom',
            path: [index, 'disciplineScopes'],
            message: 'NABL accreditation/scope entries must include disciplineScopes',
          });
        }
      });
    }),
  certificatesJson,
);

export const certificatesByKind = (kind: Certificate['kind']) =>
  certificates.filter((item) => item.kind === kind).sort((a, b) => a.order - b.order);

function todayInKolkata(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

function isCertificateInDate(certificate: Certificate): boolean {
  if (!certificate.validUntil) return true;
  // Expiry date inclusive in Asia/Kolkata.
  return todayInKolkata() <= certificate.validUntil;
}

const warnedExpired = new Set<string>();

export function isCertificateDisplayable(certificate: Certificate): boolean {
  if (!certificate.verified) return false;
  if (!isCertificateInDate(certificate)) {
    if (!warnedExpired.has(certificate.id)) {
      warnedExpired.add(certificate.id);
      console.warn(
        `[certificates] "${certificate.id}" expired on ${certificate.validUntil} (Asia/Kolkata) and is hidden from output.`,
      );
    }
    return false;
  }
  return true;
}

export function displayableCertificatesByKind(kind: Certificate['kind']): Certificate[] {
  return certificatesByKind(kind).filter((item) => isCertificateDisplayable(item));
}

export function displayableAuthorisationForBrand(brand: string): Certificate | undefined {
  return certificates.find(
    (item) =>
      item.kind === 'authorisation' &&
      item.brand === brand &&
      isCertificateDisplayable(item),
  );
}

export function hasDisplayableCertificates(): boolean {
  return certificates.some((item) => isCertificateDisplayable(item));
}

export function getCertificate(id: string): Certificate | undefined {
  return certificates.find((item) => item.id === id);
}

export function nablScopeForDiscipline(slug: string): DisciplineScope {
  if (!certificateDisciplines.includes(slug as CertificateDiscipline)) return 'none';
  const source = certificates.find(
    (item) =>
      item.kind === 'scope' &&
      item.disciplineScopes &&
      isCertificateDisplayable(item),
  );
  return source?.disciplineScopes?.[slug as CertificateDiscipline] ?? 'none';
}

export function displayableNablScopeCertificate(): Certificate | undefined {
  return certificates.find(
    (item) => item.kind === 'scope' && isCertificateDisplayable(item),
  );
}

export function displayableNablCertificate(): Certificate | undefined {
  return certificates.find(
    (item) => item.kind === 'accreditation' && isCertificateDisplayable(item),
  );
}
