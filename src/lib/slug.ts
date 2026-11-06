/**
 * A stable URL fragment for a human-readable label.
 * Used for in-page anchors such as sector headings.
 */
export function slugify(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
