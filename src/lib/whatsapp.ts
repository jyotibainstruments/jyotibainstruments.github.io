import { site } from '../config/site';

/** Builds every WhatsApp URL. The number comes from site.ts only. */
export function waLink(message: string): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function productEnquiry(product: string, code?: string): string {
  const subject = code ? `${product} ${code}` : product;
  return `Hello JIE, I am interested in ${subject}. Please provide specifications and pricing.`;
}

export function serviceEnquiry(service: string): string {
  return `Hello JIE, I would like to know more about ${service}.`;
}

export function waProps(message: string, placement: string) {
  return {
    href: waLink(message),
    target: '_blank',
    rel: 'noopener',
    'data-wa': placement,
  };
}
