import type { Beach, Municipality, Service } from "@/types/beach"

export interface MunicipalitySchema {
  "@context": "https://schema.org"
  "@type": "Place"
  name: string
  description: string
  address: PostalAddress
  url: string
}

interface GeoCoordinates {
  "@type": "GeoCoordinates"
  latitude: number
  longitude: number
}

interface PostalAddress {
  "@type": "PostalAddress"
  addressLocality: string
  addressRegion: string
  addressCountry: string
}

interface LocationFeatureSpecification {
  "@type": "LocationFeatureSpecification"
  name: string
  value: boolean
}

export interface BeachSchema {
  "@context": "https://schema.org"
  "@type": "Beach"
  name: string
  description: string
  geo: GeoCoordinates
  address: PostalAddress
  amenityFeature: Array<LocationFeatureSpecification>
  isAccessibleForFree: boolean
}

const SERVICE_TO_AMENITY: Record<string, string> = {
  parking: "Parking",
  showers: "Shower",
  toilets: "Restroom",
  footwash: "Foot Wash Station",
  umbrellas: "Beach Umbrella Rental",
  sunbeds: "Sunbed Rental",
  chiringuito: "Restaurant",
  "first-aid": "First Aid",
  "wheelchair-ramp": "Wheelchair Accessible",
}

function mapServicesToAmenities(
  serviceIndices: Array<number>,
  services: Array<Service>,
): Array<LocationFeatureSpecification> {
  return serviceIndices
    .map((index) => {
      const service = services.at(index)
      if (!service) return null
      const amenityName = SERVICE_TO_AMENITY[service.id]
      if (!amenityName) return null
      return {
        "@type": "LocationFeatureSpecification" as const,
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
    "@context": "https://schema.org",
    "@type": "Place",
    name: municipality.name,
    description: `Descubre ${beachCount === 1 ? "la playa" : `las ${beachCount} playas`} de ${municipality.name} en la Región de Murcia.`,
    address: {
      "@type": "PostalAddress",
      addressLocality: municipality.name,
      addressRegion: "Murcia",
      addressCountry: "ES",
    },
    url: `https://www.playasmurcia.com/municipios/${slug}`,
  }
}

export function generateBeachSchema(
  beach: Beach,
  municipality: Municipality,
  services: Array<Service>,
): BeachSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Beach",
    name: beach.name,
    description: beach.metaDescription ?? beach.description,
    geo: {
      "@type": "GeoCoordinates",
      latitude: beach.coordinates[0],
      longitude: beach.coordinates[1],
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: municipality.name,
      addressRegion: "Murcia",
      addressCountry: "ES",
    },
    amenityFeature: mapServicesToAmenities(beach.services, services),
    isAccessibleForFree: true,
  }
}
