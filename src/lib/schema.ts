import type { Beach, Certification, Municipality, Service } from '@/types/beach'

import { getBeachSummary } from './beach-summary'
import { getCertificationSeasonYear } from './certification-seasons'
import { parseImageFilename, pictureUrl } from './images'
import { WaterQualityStyles } from './status-styles'

const SITE_URL = process.env.SITE_URL ?? 'https://www.playasmurcia.com'

export type MunicipalitySchema = {
  '@context': 'https://schema.org'
  '@type': 'Place'
  name: string
  description: string
  address: PostalAddress
  url: string
}

type GeoCoordinates = {
  '@type': 'GeoCoordinates'
  latitude: number
  longitude: number
}

type PostalAddress = {
  '@type': 'PostalAddress'
  streetAddress?: string
  postalCode?: string
  addressLocality: string
  addressRegion: string
  addressCountry: string
}

type LocationFeatureSpecification = {
  '@type': 'LocationFeatureSpecification'
  name: string
  value: boolean | string
}

export type BeachSchema = {
  '@context': 'https://schema.org'
  '@type': 'Beach'
  name: string
  description: string
  url: string
  geo: GeoCoordinates
  address: PostalAddress
  amenityFeature: LocationFeatureSpecification[]
  isAccessibleForFree: boolean
  image?: string
}

const SERVICE_TO_AMENITY: Record<string, string> = {
  parking: 'Parking',
  showers: 'Shower',
  toilets: 'Restroom',
  footwash: 'Foot Wash Station',
  umbrellas: 'Beach Umbrella Rental',
  sunbeds: 'Sunbed Rental',
  chiringuito: 'Restaurant',
  'first-aid': 'First Aid',
  'wheelchair-ramp': 'Wheelchair Accessible',
}

function mapServicesToAmenities(
  serviceIndices: number[],
  services: Service[],
): LocationFeatureSpecification[] {
  return serviceIndices.flatMap((index) => {
    const service = services.at(index)
    const amenityName = service && SERVICE_TO_AMENITY[service.id]
    if (!amenityName) return []
    return [
      {
        '@type': 'LocationFeatureSpecification' as const,
        name: amenityName,
        value: true,
      },
    ]
  })
}

function mapSafetyFacts(beach: Beach): LocationFeatureSpecification[] {
  return [
    { name: 'Lifeguard', value: beach.lifeguard },
    { name: 'Dogs Allowed', value: beach.dogFriendly },
  ].map((fact) => ({
    '@type': 'LocationFeatureSpecification' as const,
    ...fact,
  }))
}

const CertificationNames: Record<Certification, string> = {
  'blue-flag': 'Bandera Azul',
  'q-quality': 'Q de Calidad',
  ecoplayas: 'Ecoplayas',
}

function mapOfficialFacts(beach: Beach): LocationFeatureSpecification[] {
  const certifications = (beach.certifications ?? []).map((certification) => {
    const year = getCertificationSeasonYear(certification)
    return {
      '@type': 'LocationFeatureSpecification' as const,
      name: CertificationNames[certification],
      value: year === undefined ? true : `Temporada ${String(year)}`,
    }
  })
  return beach.waterQuality
    ? [
        ...certifications,
        {
          '@type': 'LocationFeatureSpecification' as const,
          name: 'Calidad del agua',
          value: WaterQualityStyles[beach.waterQuality].label,
        },
      ]
    : certifications
}

export function generateMunicipalitySchema(
  municipality: Municipality,
  beachCount: number,
  slug: string,
): MunicipalitySchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: municipality.name,
    description: `Descubre ${beachCount === 1 ? 'la playa' : `las ${beachCount} playas`} de ${municipality.name} en la Región de Murcia.`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: municipality.name,
      addressRegion: 'Murcia',
      addressCountry: 'ES',
    },
    url: `${SITE_URL}/municipios/${slug}`,
  }
}

export function generateBeachSchema(
  beach: Beach,
  municipality: Municipality,
  services: Service[],
  slug: string,
): BeachSchema {
  const pictures = beach.pictures ?? []
  const cover = pictures.at(0)
  const firstImage = cover
    ? pictureUrl(
        `${parseImageFilename(cover).baseName}.${parseImageFilename(cover).ext}`,
      )
    : undefined

  return {
    '@context': 'https://schema.org',
    '@type': 'Beach',
    name: beach.name,
    description: getBeachSummary(beach.name, beach.description),
    url: `${SITE_URL}/playas/${slug}`,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: beach.coordinates[0],
      longitude: beach.coordinates[1],
    },
    address: {
      '@type': 'PostalAddress',
      ...(beach.address && { streetAddress: beach.address }),
      ...(beach.postalCode && { postalCode: beach.postalCode }),
      addressLocality: municipality.name,
      addressRegion: 'Murcia',
      addressCountry: 'ES',
    },
    amenityFeature: [
      ...mapServicesToAmenities(beach.services, services),
      ...mapSafetyFacts(beach),
      ...mapOfficialFacts(beach),
    ],
    isAccessibleForFree: true,
    ...(firstImage && { image: firstImage }),
  }
}
