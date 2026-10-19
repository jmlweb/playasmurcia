import { describe, expect, it } from 'vitest'

import type { Beach } from '@/types/beach'

import { pickCoverPicture } from './collection-covers'

function makeBeach(overrides: Partial<Beach> & { code: string }): Beach {
  return {
    name: 'Test Beach',
    municipality: 0,
    sea: 0,
    coordinates: [0, 0],
    soilType: 'sand',
    nudist: false,
    promenade: false,
    anchorageZone: false,
    dogFriendly: false,
    lifeguard: false,
    services: [],
    activities: [],
    description: '',
    access: '',
    nearby: [],
    orientation: '',
    instagramHashtag: '',
    recommendationScore: 50,
    pictures: [`${overrides.code}.jpg`],
    ...overrides,
  }
}

describe('pickCoverPicture', () => {
  it('prefers the highest pictureQualityScore, then recommendation score', () => {
    const beaches = [
      makeBeach({ code: 'a', pictureQualityScore: 1, recommendationScore: 90 }),
      makeBeach({ code: 'b', pictureQualityScore: 3, recommendationScore: 10 }),
      makeBeach({ code: 'c', pictureQualityScore: 3, recommendationScore: 40 }),
    ]

    expect(pickCoverPicture(beaches, new Set())).toBe('c.jpg')
  })

  it('skips used beaches and records the chosen one', () => {
    const beaches = [
      makeBeach({ code: 'a', pictureQualityScore: 3 }),
      makeBeach({ code: 'b', pictureQualityScore: 2 }),
    ]
    const used = new Set(['a'])

    expect(pickCoverPicture(beaches, used)).toBe('b.jpg')
    expect(used).toStrictEqual(new Set(['a', 'b']))
  })

  it('ignores beaches without pictures', () => {
    const beaches = [makeBeach({ code: 'a', pictures: [] })]

    expect(pickCoverPicture(beaches, new Set())).toBeUndefined()
  })
})
