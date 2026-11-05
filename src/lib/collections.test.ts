import { describe, expect, it } from 'vitest'

import type { Beach } from '@/types/beach'

import { filterBeachesByCollection, getCollectionBySlug } from './collections'

// Tag indices follow data/tags.json: 2 = familiar, 3 = aguas-tranquilas
const makeBeach = (overrides: Partial<Beach>): Beach => ({
  code: 'x',
  name: 'Playa X',
  municipality: 0,
  sea: 0,
  coordinates: [37.5, -1.2],
  soilType: 'arena',
  nudist: false,
  promenade: false,
  anchorageZone: false,
  dogFriendly: false,
  lifeguard: true,
  services: [],
  activities: [],
  description: '',
  access: '',
  nearby: [],
  orientation: 'sur',
  instagramHashtag: '',
  recommendationScore: 0,
  ...overrides,
})

describe('playas-familiares collection', () => {
  const collection = getCollectionBySlug('playas-familiares')
  const run = (beaches: Beach[]) =>
    collection ? filterBeachesByCollection(beaches, collection) : []

  it('keeps childSafe beaches with a family tag and a lifeguard', () => {
    const safe = makeBeach({ code: 'a', tags: [2], childSafe: true })
    expect(run([safe])).toEqual([safe])
  })

  it('drops beaches marked childSafe false even with family tags', () => {
    const unsafe = makeBeach({ code: 'b', tags: [2, 3], childSafe: false })
    expect(run([unsafe])).toEqual([])
  })

  it('drops beaches whose childSafe is unknown', () => {
    expect(run([makeBeach({ code: 'c', tags: [2] })])).toEqual([])
  })

  it('still requires a lifeguard', () => {
    const noGuard = makeBeach({
      code: 'd',
      tags: [3],
      childSafe: true,
      lifeguard: false,
    })
    expect(run([noGuard])).toEqual([])
  })
})
