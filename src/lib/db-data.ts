import { eq, inArray } from 'drizzle-orm'

import { db } from '@/db/client'
import * as schema from '@/db/schema'
import { beachToSlug, municipalityToSlug } from '@/lib/slugs'
import type {
  Activity,
  Beach,
  Certification,
  Municipality,
  Sea,
  Service,
  Tag,
} from '@/types/beach'

type OccupancyLevel = 'low' | 'medium' | 'high'

/**
 * Computes a recommendation score (0-1) from internal beach data.
 *
 * Weights: services 30%, length 15%, photo quality 10%,
 * accessibility 15%, blue flag 15%, child-safe 10%, natural shade 5%
 */
function computeRecommendationScore(beach: {
  services: number[]
  length: number | null
  pictureQualityScore: number | null
  accessDifficulty: string | null
  certifications: string | null
  childSafe: boolean | null
  naturalShade: boolean | null
}): number {
  // Services: 0-1 normalized (cap at 8 services for max score)
  const servicesScore = Math.min(beach.services.length / 8, 1)

  // Length: 0-1 normalized (cap at 1000m for max score)
  const lengthScore =
    beach.length != null ? Math.min(beach.length / 1000, 1) : 0.3

  // Photo quality: 0-1 from 0-3 score
  const photoScore = (beach.pictureQualityScore ?? 0) / 3

  // Accessibility: easy=1, moderate=0.6, hard=0.2, unknown=0.5
  const accessMap: Record<string, number> = {
    easy: 1,
    moderate: 0.6,
    hard: 0.2,
  }
  const accessScore = beach.accessDifficulty
    ? (accessMap[beach.accessDifficulty] ?? 0.5)
    : 0.5

  // Blue flag: boolean
  const certs = beach.certifications ? JSON.parse(beach.certifications) : []
  const blueFlagScore = (certs as string[]).includes('blue-flag') ? 1 : 0

  // Child-safe: boolean
  const childSafeScore = beach.childSafe ? 1 : 0

  // Natural shade: boolean
  const shadeScore = beach.naturalShade ? 1 : 0

  return (
    servicesScore * 0.3 +
    lengthScore * 0.15 +
    photoScore * 0.1 +
    accessScore * 0.15 +
    blueFlagScore * 0.15 +
    childSafeScore * 0.1 +
    shadeScore * 0.05
  )
}

function adjustOccupancy(stored: OccupancyLevel): OccupancyLevel {
  const month = new Date().getMonth() // 0-based

  // July–August: use stored value as-is
  if (month === 6 || month === 7) return stored

  // June and September: cap at medium
  if (month === 5 || month === 8) {
    return stored === 'high' ? 'medium' : stored
  }

  // Rest of the year: always low
  return 'low'
}

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
  pictureQualityScore: number | null
  aemetId: string | null
  length: number | null
  accessDifficulty: string | null
  childSafe: boolean | null
  naturalShade: boolean | null
  waterQuality: string | null
  services: { serviceId: number }[]
  activities: { activityId: number }[]
  tags: { tagId: number }[]
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
      occupancyLevel: adjustOccupancy(
        dbBeach.occupancyLevel as 'low' | 'medium' | 'high',
      ),
    }),
    ...(dbBeach.campingNearby !== null && {
      campingNearby: dbBeach.campingNearby,
    }),
    ...(dbBeach.metaDescription && {
      metaDescription: dbBeach.metaDescription,
    }),
    ...(dbBeach.seoKeywords && {
      seoKeywords: JSON.parse(dbBeach.seoKeywords),
    }),
    ...(dbBeach.certifications && {
      certifications: JSON.parse(dbBeach.certifications) as Certification[],
    }),
    ...(dbBeach.bestSeason && {
      bestSeason: JSON.parse(dbBeach.bestSeason) as (
        | 'spring'
        | 'summer'
        | 'autumn'
        | 'winter'
      )[],
    }),
    ...(dbBeach.district && { district: dbBeach.district }),
    ...(dbBeach.phone && { phone: dbBeach.phone }),
    ...(dbBeach.email && { email: dbBeach.email }),
    ...(dbBeach.realUrl && { realUrl: dbBeach.realUrl }),
    ...(dbBeach.waves && { waves: dbBeach.waves }),
    ...(dbBeach.pictures && { pictures: JSON.parse(dbBeach.pictures) }),
    ...(dbBeach.pictureQualityScore != null && {
      pictureQualityScore: dbBeach.pictureQualityScore as 0 | 1 | 2 | 3,
    }),
    ...(dbBeach.aemetId && { aemetId: dbBeach.aemetId }),
    ...(dbBeach.length !== null && { length: dbBeach.length }),
    ...(dbBeach.accessDifficulty && {
      accessDifficulty: dbBeach.accessDifficulty as
        | 'easy'
        | 'moderate'
        | 'hard',
    }),
    ...(dbBeach.childSafe !== null && { childSafe: dbBeach.childSafe }),
    ...(dbBeach.naturalShade !== null && {
      naturalShade: dbBeach.naturalShade,
    }),
    ...(dbBeach.waterQuality && {
      waterQuality: dbBeach.waterQuality as
        | 'excellent'
        | 'good'
        | 'sufficient'
        | 'poor',
    }),
    ...(dbBeach.tags.length > 0 && {
      tags: dbBeach.tags.map((t) => t.tagId - 1), // Convert to 0-based index
    }),
    recommendationScore: computeRecommendationScore({
      services: dbBeach.services.map((s) => s.serviceId - 1),
      length: dbBeach.length,
      pictureQualityScore: dbBeach.pictureQualityScore,
      accessDifficulty: dbBeach.accessDifficulty,
      certifications: dbBeach.certifications,
      childSafe: dbBeach.childSafe,
      naturalShade: dbBeach.naturalShade,
    }),
  }
}

/**
 * Retrieves all beaches from the database
 */
export async function getAllBeaches(): Promise<Beach[]> {
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

// Re-export slug functions for backwards compatibility
export { beachToSlug, municipalityToSlug } from '@/lib/slugs'

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
export async function getAllMunicipalities(): Promise<Municipality[]> {
  const dbMunicipalities = await db.query.municipalities.findMany({
    orderBy: (municipalities, { asc }) => [asc(municipalities.id)],
  })

  return dbMunicipalities.map((m) => ({
    name: m.name,
    id: m.ineCode,
  }))
}

/**
 * Returns a Map keyed by the 0-based municipality index used in Beach.municipality
 */
export async function getMunicipalityMap(): Promise<Map<number, Municipality>> {
  const dbMunicipalities = await db.query.municipalities.findMany({
    orderBy: (municipalities, { asc }) => [asc(municipalities.id)],
  })

  return new Map(
    dbMunicipalities.map((m, index) => [
      index,
      { name: m.name, id: m.ineCode },
    ]),
  )
}

/**
 * Retrieves all services from the database
 */
export async function getAllServices(): Promise<Service[]> {
  const dbServices = await db.query.services.findMany({
    orderBy: (services, { asc }) => [asc(services.id)],
  })

  return dbServices.map((s) => ({
    id: s.serviceId,
    name: s.name,
    icon: s.icon,
  }))
}

/**
 * Retrieves all activities from the database
 */
export async function getAllActivities(): Promise<Activity[]> {
  const dbActivities = await db.query.activities.findMany({
    orderBy: (activities, { asc }) => [asc(activities.id)],
  })

  return dbActivities.map((a) => ({
    id: a.activityId,
    name: a.name,
    icon: a.icon,
  }))
}

/**
 * Retrieves all tags from the database
 */
export async function getAllTags(): Promise<Tag[]> {
  const dbTags = await db.query.tags.findMany({
    orderBy: (tags, { asc }) => [asc(tags.id)],
  })

  return dbTags.map((t) => ({
    id: t.tagId,
    name: t.name,
  }))
}

/**
 * Retrieves multiple beaches by their codes (used for nearby beaches)
 */
export async function getNearbyBeaches(codes: string[]): Promise<Beach[]> {
  if (codes.length === 0) {
    return []
  }

  const dbBeaches = await db.query.beaches.findMany({
    where: inArray(schema.beaches.code, codes),
    with: {
      services: true,
      activities: true,
      tags: true,
    },
  })

  return dbBeaches.map(mapBeachFromDB)
}

/**
 * Finds a municipality by its slug
 */
export async function getMunicipalityBySlug(
  slug: string,
): Promise<{ municipality: Municipality; index: number } | undefined> {
  const municipalities = await getAllMunicipalities()
  const index = municipalities.findIndex((m) => municipalityToSlug(m) === slug)
  if (index === -1) return undefined
  return { municipality: municipalities[index], index }
}

/**
 * Retrieves all beaches for a given municipality (0-based index)
 */
export async function getBeachesByMunicipality(
  municipalityIndex: number,
): Promise<Beach[]> {
  const dbBeaches = await db.query.beaches.findMany({
    where: eq(schema.beaches.municipalityId, municipalityIndex + 1),
    with: { services: true, activities: true, tags: true },
  })
  return dbBeaches.map(mapBeachFromDB)
}

/**
 * Retrieves all seas from the database
 */
export async function getAllSeas(): Promise<Sea[]> {
  const dbSeas = await db.query.seas.findMany({
    orderBy: (seas, { asc }) => [asc(seas.id)],
  })

  return dbSeas.map((s) => ({
    name: s.name,
    jellyfishRisk: s.jellyfishRisk,
  }))
}

/**
 * Returns ~10 featured beaches selected by picture quality and geographic spread.
 * Picks the top-scoring beaches (pictureQualityScore >= 2) ensuring at most
 * 2 beaches per municipality for diversity, sorted by quality then name.
 */
export async function getFeaturedBeaches(): Promise<Beach[]> {
  const allBeaches = await getAllBeaches()

  // Filter to beaches with good photos
  const withPhotos = allBeaches
    .filter(
      (b) =>
        b.pictures &&
        b.pictures.length > 0 &&
        (b.pictureQualityScore ?? 0) >= 2,
    )
    .sort((a, b) => {
      const scoreA = a.pictureQualityScore ?? 0
      const scoreB = b.pictureQualityScore ?? 0
      if (scoreB !== scoreA) return scoreB - scoreA
      return a.name.localeCompare(b.name)
    })

  // Limit per municipality for geographic spread
  const municipalityCounts = new Map<number, number>()
  const featured: Beach[] = []

  for (const beach of withPhotos) {
    const count = municipalityCounts.get(beach.municipality) ?? 0
    if (count >= 2) continue
    municipalityCounts.set(beach.municipality, count + 1)
    featured.push(beach)
    if (featured.length >= 12) break
  }

  return featured
}
