import { describe, expect, it } from 'vitest'

import { mapBeachFromDB } from './beach-mapper'

type DbBeach = Parameters<typeof mapBeachFromDB>[0]

const makeDbBeach = (overrides: Partial<DbBeach>): DbBeach => ({
  id: 1,
  code: 'no-itrem-sheet',
  name: 'Playa de prueba',
  municipalityId: 1,
  seaId: 1,
  latitude: 37.6,
  longitude: -0.9,
  soilType: 'Arena fina',
  nudist: false,
  promenade: false,
  anchorageZone: false,
  dogFriendly: false,
  lifeguard: false,
  description: '',
  access: '',
  nearby: '[]',
  orientation: 'south',
  shoreBearing: null,
  instagramHashtag: '',
  occupancyLevel: null,
  campingNearby: null,
  metaDescription: null,
  seoKeywords: null,
  certifications: null,
  bestSeason: null,
  district: null,
  zone: null,
  phone: null,
  email: null,
  realUrl: null,
  address: null,
  postalCode: null,
  waves: null,
  pictures: null,
  pictureQualityScore: null,
  aemetId: null,
  length: null,
  accessDifficulty: null,
  childSafe: null,
  naturalShade: null,
  waterQuality: null,
  waterQualitySource: null,
  services: [],
  activities: [],
  tags: [],
  ...overrides,
})

describe('mapBeachFromDB length', () => {
  // Cala Cortina: OSM says 410 m, its ITREM sheet 210 m. Cards and the length
  // sort read `length`, so it must match what the beach page shows
  it('exposes the ITREM length when the beach has a sheet', () => {
    const beach = mapBeachFromDB(makeDbBeach({ code: '512', length: 410 }))
    expect(beach.length).toBe(210)
  })

  it('falls back to the stored length without a sheet', () => {
    expect(mapBeachFromDB(makeDbBeach({ length: 300 })).length).toBe(300)
  })

  it('leaves the length out when neither source has one', () => {
    expect(mapBeachFromDB(makeDbBeach({})).length).toBeUndefined()
  })
})
