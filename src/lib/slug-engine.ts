import { RESERVED_SLUGS } from '@/config/domains';

export function cleanSlug(slug: string): string {
  return slug
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function validateSlug(slug: string): { valid: boolean; error?: string } {
  const cleaned = cleanSlug(slug);
  if (!cleaned || cleaned.length < 2) {
    return { valid: false, error: 'Slug must be at least 2 alphanumeric characters.' };
  }
  if (RESERVED_SLUGS.has(cleaned)) {
    return { valid: false, error: `The slug "/${cleaned}" is reserved by the system.` };
  }
  return { valid: true };
}

export function autoGenerateSlug(groom: string, bride: string): string {
  const g = groom.trim().split(/\s+/)[0] || '';
  const b = bride.trim().split(/\s+/)[0] || '';
  if (!g && !b) return '';
  return cleanSlug(`${g}-weds-${b}`);
}
