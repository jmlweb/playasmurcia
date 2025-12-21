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
  services: number[]
  activities: number[]
  description: string
  access: string
  nearby: string[]
  orientation: string
  instagramHashtag: string
  occupancyLevel?: "low" | "medium" | "high"
  campingNearby?: boolean
  metaDescription?: string
  seoKeywords?: string[]
  certifications?: ("blue-flag" | "q-quality" | "ecoplayas")[]
  bestSeason?: ("spring" | "summer" | "autumn" | "winter")[]
  district?: string
  phone?: string
  email?: string
  realUrl?: string
  waves?: string
  pictures?: string[]
  aemetId?: string
  length?: number
  tags?: number[]
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
