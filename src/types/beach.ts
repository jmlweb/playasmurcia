export type Certification = 'blue-flag' | 'q-quality' | 'ecoplayas'

export type Beach = {
  code: string
  name: string
  municipality: number
  sea: number
  coordinates: [number, number]
  soilType: string
  nudist: boolean
  promenade: boolean
  anchorageZone: boolean
  dogFriendly: boolean
  lifeguard: boolean
  services: number[]
  activities: number[]
  description: string
  access: string
  nearby: string[]
  orientation: string
  shoreBearing?: number
  instagramHashtag: string
  occupancyLevel?: 'low' | 'medium' | 'high'
  campingNearby?: boolean
  metaDescription?: string
  seoKeywords?: string[]
  certifications?: Certification[]
  bestSeason?: ('spring' | 'summer' | 'autumn' | 'winter')[]
  district?: string
  phone?: string
  email?: string
  realUrl?: string
  waves?: string
  pictures?: string[]
  pictureQualityScore?: 0 | 1 | 2 | 3
  aemetId?: string
  length?: number
  accessDifficulty?: 'easy' | 'moderate' | 'hard'
  childSafe?: boolean
  naturalShade?: boolean
  waterQuality?: WaterQuality
  waterQualitySource?: WaterQualitySource
  tags?: number[]
  recommendationScore: number
}

export type Service = {
  id: string
  name: string
  icon: string
}

export type Activity = {
  id: string
  name: string
  icon: string
}

export type Tag = {
  id: string
  name: string
}

export type Sea = {
  name: string
  jellyfishRisk: string
}

export type Municipality = {
  name: string
  id: string
}

/** EU bathing-water class (Directive 2006/7/EC) */
export type WaterQuality = 'excellent' | 'good' | 'sufficient' | 'poor'

/** EEA / NÁYADE sampling point the official class comes from */
export type WaterQualitySource = {
  season: number
  samplingPointId: string
  samplingPointName: string
  distanceMeters: number
  profileUrl?: string
}
