import { eq } from "drizzle-orm"
import type { Beach, Municipality, Service } from "@/types/beach"

import { db } from "@/db/client"
import * as schema from "@/db/schema"

/**
 * Maps a database beach record with its relations to the Beach type
 */
function mapBeachFromDB(dbBeach: {
  id: number
  code: string
  name: string
  municipalityId: number
  seaId: number
  latitude: number
  longitude: number
  soilType: string
  nudist: boolean
  promenade: boolean
  anchorageZone: boolean
  dogFriendly: boolean
  lifeguard: boolean
  description: string
  access: string
  nearby: string
  orientation: string
  instagramHashtag: string
  occupancyLevel: string | null
  campingNearby: boolean | null
  metaDescription: string | null
  seoKeywords: string | null
  certifications: string | null
  bestSeason: string | null
  district: string | null
  phone: string | null
  email: string | null
  realUrl: string | null
  waves: string | null
  pictures: string | null
  aemetId: string | null
  length: number | null
  services: Array<{ serviceId: number }>
  activities: Array<{ activityId: number }>
  tags: Array<{ tagId: number }>
}): Beach {
  return {
    code: dbBeach.code,
    name: dbBeach.name,
    municipality: dbBeach.municipalityId - 1, // Convert to 0-based index
    sea: dbBeach.seaId - 1, // Convert to 0-based index
    coordinates: [dbBeach.latitude, dbBeach.longitude],
    soilType: dbBeach.soilType,
    nudist: dbBeach.nudist,
    promenade: dbBeach.promenade,
    anchorageZone: dbBeach.anchorageZone,
    dogFriendly: dbBeach.dogFriendly,
    lifeguard: dbBeach.lifeguard,
    services: dbBeach.services.map((s) => s.serviceId - 1), // Convert to 0-based index
    activities: dbBeach.activities.map((a) => a.activityId - 1), // Convert to 0-based index
    description: dbBeach.description,
    access: dbBeach.access,
    nearby: JSON.parse(dbBeach.nearby),
    orientation: dbBeach.orientation,
    instagramHashtag: dbBeach.instagramHashtag,
    ...(dbBeach.occupancyLevel && {
      occupancyLevel: dbBeach.occupancyLevel as "low" | "medium" | "high",
    }),
    ...(dbBeach.campingNearby !== null && { campingNearby: dbBeach.campingNearby }),
    ...(dbBeach.metaDescription && { metaDescription: dbBeach.metaDescription }),
    ...(dbBeach.seoKeywords && { seoKeywords: JSON.parse(dbBeach.seoKeywords) }),
    ...(dbBeach.certifications && {
      certifications: JSON.parse(dbBeach.certifications) as Array<
        "blue-flag" | "q-quality" | "ecoplayas"
      >,
    }),
    ...(dbBeach.bestSeason && {
      bestSeason: JSON.parse(dbBeach.bestSeason) as Array<
        "spring" | "summer" | "autumn" | "winter"
      >,
    }),
    ...(dbBeach.district && { district: dbBeach.district }),
    ...(dbBeach.phone && { phone: dbBeach.phone }),
    ...(dbBeach.email && { email: dbBeach.email }),
    ...(dbBeach.realUrl && { realUrl: dbBeach.realUrl }),
    ...(dbBeach.waves && { waves: dbBeach.waves }),
    ...(dbBeach.pictures && { pictures: JSON.parse(dbBeach.pictures) }),
    ...(dbBeach.aemetId && { aemetId: dbBeach.aemetId }),
    ...(dbBeach.length !== null && { length: dbBeach.length }),
    ...(dbBeach.tags.length > 0 && {
      tags: dbBeach.tags.map((t) => t.tagId - 1), // Convert to 0-based index
    }),
  }
}

/**
 * Retrieves all beaches from the database
 */
export async function getAllBeaches(): Promise<Array<Beach>> {
  const dbBeaches = await db.query.beaches.findMany({
    with: {
      services: true,
      activities: true,
      tags: true,
    },
  })

  return dbBeaches.map(mapBeachFromDB)
}

/**
 * Finds a beach by its unique code
 */
export async function getBeachByCode(code: string): Promise<Beach | undefined> {
  const dbBeach = await db.query.beaches.findFirst({
    where: eq(schema.beaches.code, code),
    with: {
      services: true,
      activities: true,
      tags: true,
    },
  })

  return dbBeach ? mapBeachFromDB(dbBeach) : undefined
}

/**
 * Finds a beach by its slug (normalized name)
 */
export async function getBeachBySlug(slug: string): Promise<Beach | undefined> {
  const allBeaches = await getAllBeaches()

  return allBeaches.find((beach) => beachToSlug(beach) === slug)
}

/**
 * Converts a beach name to a URL-friendly slug
 */
export function beachToSlug(beach: Beach): string {
  return beach.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
}

/**
 * Retrieves a municipality by its index (0-based)
 */
export async function getMunicipality(index: number): Promise<Municipality> {
  const dbMunicipality = await db.query.municipalities.findFirst({
    where: eq(schema.municipalities.id, index + 1), // Convert from 0-based to 1-based
  })

  if (!dbMunicipality) {
    throw new Error(`Municipality not found at index ${index}`)
  }

  return {
    name: dbMunicipality.name,
    id: dbMunicipality.ineCode,
  }
}

/**
 * Retrieves a service by its index (0-based)
 */
export async function getService(index: number): Promise<Service> {
  const dbService = await db.query.services.findFirst({
    where: eq(schema.services.id, index + 1), // Convert from 0-based to 1-based
  })

  if (!dbService) {
    throw new Error(`Service not found at index ${index}`)
  }

  return {
    id: dbService.serviceId,
    name: dbService.name,
    icon: dbService.icon,
  }
}

/**
 * Retrieves all municipalities from the database
 */
export async function getAllMunicipalities(): Promise<Array<Municipality>> {
  const dbMunicipalities = await db.query.municipalities.findMany({
    orderBy: (municipalities, { asc }) => [asc(municipalities.id)],
  })

  return dbMunicipalities.map((m) => ({
    name: m.name,
    id: m.ineCode,
  }))
}

/**
 * Retrieves all services from the database
 */
export async function getAllServices(): Promise<Array<Service>> {
  const dbServices = await db.query.services.findMany({
    orderBy: (services, { asc }) => [asc(services.id)],
  })

  return dbServices.map((s) => ({
    id: s.serviceId,
    name: s.name,
    icon: s.icon,
  }))
}
