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
  certifications?: Array<"blue-flag" | "q-quality" | "ecoplayas">
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

export interface Municipality {
  name: string
  id: string
}
