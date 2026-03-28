import type { Beach, Municipality, Service } from '@/types/beach'

const SITE_URL = process.env.SITE_URL ?? 'https://www.playasmurcia.com'
const PICTURES_BASE_URL =
  'https://www.turismoregiondemurcia.es/webs/murciaturistica/fotos/1/playas/'

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
  addressLocality: string
  addressRegion: string
  addressCountry: string
}

type LocationFeatureSpecification = {
  '@type': 'LocationFeatureSpecification'
  name: string
  value: boolean
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
  return serviceIndices
    .map((index) => {
      const service = services.at(index)
      if (!service) return null
      const amenityName = SERVICE_TO_AMENITY[service.id]
      if (!amenityName) return null
      return {
        '@type': 'LocationFeatureSpecification' as const,
        name: amenityName,
        value: true,
      }
    })
    .filter((item): item is LocationFeatureSpecification => item !== null)
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
  const firstImage =
    pictures.length > 0 ? `${PICTURES_BASE_URL}${pictures[0]}` : undefined

  return {
    '@context': 'https://schema.org',
    '@type': 'Beach',
    name: beach.name,
    description: beach.metaDescription ?? beach.description,
    url: `${SITE_URL}/playas/${slug}`,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: beach.coordinates[0],
      longitude: beach.coordinates[1],
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: municipality.name,
      addressRegion: 'Murcia',
      addressCountry: 'ES',
    },
    amenityFeature: mapServicesToAmenities(beach.services, services),
    isAccessibleForFree: true,
    ...(firstImage && { image: firstImage }),
  }
}
