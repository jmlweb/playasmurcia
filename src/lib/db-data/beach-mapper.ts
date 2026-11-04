import type { Beach, Certification } from '@/types/beach'

import { computeRecommendationScore } from './beach-scoring'

/**
 * Maps a database beach record with its relations to the Beach type
 */
export function mapBeachFromDB(dbBeach: {
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
  shoreBearing: number | null
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
  waterQualitySource: string | null
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
    ...(dbBeach.shoreBearing != null && {
      shoreBearing: dbBeach.shoreBearing,
    }),
    instagramHashtag: dbBeach.instagramHashtag,
    ...(dbBeach.occupancyLevel && {
      occupancyLevel: dbBeach.occupancyLevel as 'low' | 'medium' | 'high',
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
    ...(dbBeach.waterQualitySource && {
      waterQualitySource: JSON.parse(dbBeach.waterQualitySource),
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
