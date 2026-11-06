import { site, primaryPhone, type Office } from '../config/site';
import { absoluteAsset, absoluteUrl, e164 } from './url';

export type JsonLd = Record<string, unknown>;

const ORGANIZATION_ID = `${absoluteUrl('/')}#organization`;

export function buildTitle(page?: string): string {
  return page ? `${page} | ${site.shortName}` : `${site.name} | ${site.shortName}`;
}

export function organizationJsonLd(): JsonLd {
  const email = site.emails.at(0);

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: site.name,
    alternateName: site.shortName,
    url: absoluteUrl('/'),
    logo: absoluteAsset('/logo-512.png'),
    ...(email ? { email } : {}),
    ...(primaryPhone ? { telephone: e164(primaryPhone) } : {}),
  };
}

export function webSiteJsonLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: absoluteUrl('/'),
    inLanguage: 'en-IN',
    publisher: { '@id': ORGANIZATION_ID },
  };
}

export function localBusinessJsonLd(office: Office): JsonLd {
  if (!office.addressParts) {
    throw new Error(`Office "${office.slug}" needs a structured address for LocalBusiness JSON-LD.`);
  }

  const phone = office.phones.at(0);
  const email = site.emails.at(0);

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${absoluteUrl('/')}#${office.slug}`,
    name: site.name,
    url: absoluteUrl('/contact/'),
    image: absoluteAsset('/logo-512.png'),
    address: {
      '@type': 'PostalAddress',
      streetAddress: office.addressParts.streetAddress,
      addressLocality: office.addressParts.addressLocality,
      postalCode: office.addressParts.postalCode,
      addressRegion: office.addressParts.addressRegion,
      addressCountry: office.addressParts.addressCountry,
    },
    parentOrganization: { '@id': ORGANIZATION_ID },
    ...(phone ? { telephone: e164(phone) } : {}),
    ...(email ? { email } : {}),
  };
}

export function serviceJsonLd(input: {
  name: string;
  description: string;
  path: string;
}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: input.name,
    description: input.description,
    serviceType: input.name,
    provider: { '@id': ORGANIZATION_ID },
    areaServed: site.cities.map((city) => ({ '@type': 'City', name: city })),
    url: absoluteUrl(input.path),
  };
}

export type BreadcrumbItem = {
  name: string;
  path: string;
};

export function breadcrumbJsonLd(items: BreadcrumbItem[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function collectionPageJsonLd(input: {
  name: string;
  description: string;
  path: string;
}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    isPartOf: {
      '@type': 'WebSite',
      name: site.name,
      url: absoluteUrl('/'),
    },
    about: { '@id': ORGANIZATION_ID },
  };
}

export function faqJsonLd(items: Array<{ question: string; answer: string }>): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}
