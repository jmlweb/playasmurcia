import type { Beach, Municipality } from '@/types/beach'

export function beachToSlug(beach: Beach): string {
  return beach.name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
}

export function municipalityToSlug(municipality: Municipality): string {
  return municipality.name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
}
