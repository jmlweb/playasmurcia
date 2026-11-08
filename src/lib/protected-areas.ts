// Point-in-polygon results from scripts/fetch-protected-areas.ts; see docs/data-schema.md.
import protectedAreas from '../../data/protected-areas.json'

export type NaturaSite = {
  code: string
  name: string
  /** A = birds directive (ZEPA), B = habitats directive (LIC/ZEC), C = both */
  type: 'A' | 'B' | 'C'
}

export type RegionalSite = {
  code: string
  name: string
  figure: string
  norm: string
}

export type ProtectedAreas = {
  natura2000: NaturaSite[]
  regional: RegionalSite[]
}

// Sites whose polygon is the sea (or the lagoon) in front of the beach, not the sand
const MarineSiteCodes = new Set([
  'ES6200029', // Franja Litoral Sumergida de la Región de Murcia
  'ES6200048', // Valles submarinos del Escarpe de Mazarrón
  'ES0000507', // Espacio marino de los Islotes Litorales de Murcia y Almería
  'ES0000508', // Espacio marino de Tabarca-Cabo de Palos
  'ESZZ16009', // Espacio marino de Cabo Roig
  'ES6110010', // Fondos Marinos Levante Almeriense
  'ES6200030', // Mar Menor (LIC)
  'ES0000260', // Mar Menor (ZEPA)
])

const values = protectedAreas.values as Record<string, ProtectedAreas>

export const protectedAreasSources = {
  natura2000: protectedAreas.natura2000Source,
  regional: protectedAreas.regionalSource,
  fetchedOn: protectedAreas.fetchedOn,
  bufferMetres: protectedAreas.bufferMetres,
}

export const NaturaTypeLabels: Record<NaturaSite['type'], string> = {
  A: 'ZEPA',
  B: 'LIC/ZEC',
  C: 'LIC/ZEC y ZEPA',
}

export const isMarineSite = (site: NaturaSite): boolean =>
  MarineSiteCodes.has(site.code)

export const getProtectedAreas = (code: string): ProtectedAreas | undefined =>
  values[code]
