const SITE_ORIGIN = (
  import.meta.env.SITE ?? 'https://jyotibainstruments.github.io'
).replace(/\/+$/, '');

const BASE_URL = (import.meta.env.BASE_URL || '/').replace(/\/?$/, '/');

function joinBase(path: string): string {
  return `${BASE_URL}${path.replace(/^\/+/, '')}`;
}

/** A site route. Always ends with a slash. */
export function url(path = '/'): string {
  const joined = joinBase(path);
  return joined.endsWith('/') ? joined : `${joined}/`;
}

/** A file in public/. No trailing slash. */
export function asset(path: string): string {
  return joinBase(path);
}

export function absoluteUrl(path = '/'): string {
  return new URL(url(path), SITE_ORIGIN).href;
}

export function absoluteAsset(path: string): string {
  return new URL(asset(path), SITE_ORIGIN).href;
}

export function e164(phone: string): string {
  return `+91${phone.replace(/\s+/g, '')}`;
}

export function telHref(phone: string): string {
  return `tel:${e164(phone)}`;
}

export function mailtoHref(email: string): string {
  return `mailto:${email}`;
}

export function mapSearchHref(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
