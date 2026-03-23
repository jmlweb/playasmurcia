export type Certification = "blue-flag" | "q-quality" | "ecoplayas"

export interface Beach {
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
  services: Array<number>
  activities: Array<number>
  description: string
  access: string
  nearby: Array<string>
  orientation: string
  instagramHashtag: string
  occupancyLevel?: "low" | "medium" | "high"
  campingNearby?: boolean
  metaDescription?: string
  seoKeywords?: Array<string>
  certifications?: Array<Certification>
  bestSeason?: Array<"spring" | "summer" | "autumn" | "winter">
  district?: string
  phone?: string
  email?: string
  realUrl?: string
  waves?: string
  pictures?: Array<string>
  aemetId?: string
  length?: number
  tags?: Array<number>
}

export interface Service {
  id: string
  name: string
  icon: string
}

export interface Activity {
  id: string
  name: string
  icon: string
}

export interface Tag {
  id: string
  name: string
}

export interface Sea {
  name: string
  jellyfishRisk: string
}

export interface Municipality {
  name: string
  id: string
}
