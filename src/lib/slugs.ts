import type { Beach, Municipality } from '@/types/beach'

export function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[().]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

// URLs indexed before parentheses and periods were stripped; kept only so
// they can 301 to the current slug.
export function legacyNameToSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '-')
}

export function beachToSlug(beach: Beach): string {
  return nameToSlug(beach.name)
}

export function municipalityToSlug(municipality: Municipality): string {
  return nameToSlug(municipality.name)
}
