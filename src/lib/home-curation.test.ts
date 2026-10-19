import { describe, expect, it } from 'vitest'

import type { Beach } from '@/types/beach'

import { formatMunicipalityMeta } from '@/features/municipalities/municipality-card'

import { addMunicipalityCovers, selectFeaturedBeaches } from './home-curation'

function makeBeach(overrides: Partial<Beach>): Beach {
  return {
    code: 'X',
    name: 'Test',
    municipality: 0,
    pictures: ['a_g.jpg'],
    ...overrides,
  } as Beach
}

describe('selectFeaturedBeaches', () => {
  it('keeps curated order and skips missing or picture-less beaches', () => {
    const beaches = [
      makeBeach({ code: '1' }),
      makeBeach({ code: '2' }),
      makeBeach({ code: '3', pictures: [] }),
    ]
    const result = selectFeaturedBeaches(beaches, ['2', '3', '9', '1'])
    expect(result.map((b) => b.code)).toEqual(['2', '1'])
  })
})

describe('addMunicipalityCovers', () => {
  const nav = [
    { name: 'A', slug: 'a', beachCount: 2, blueFlagCount: 0 },
    { name: 'B', slug: 'b', beachCount: 1, blueFlagCount: 0 },
  ]

  it('prefers the curated cover, then the best-scored photo', () => {
    const beaches = [
      makeBeach({ code: '1', municipality: 0, pictures: ['low.jpg'] }),
      makeBeach({
        code: '2',
        municipality: 0,
        pictures: ['curated.jpg'],
        pictureQualityScore: 1,
      }),
      makeBeach({
        code: '3',
        municipality: 1,
        pictures: ['best.jpg'],
        pictureQualityScore: 3,
      }),
    ]
    const result = addMunicipalityCovers(nav, beaches, ['2'])
    expect(result.map((m) => m.coverPicture)).toEqual([
      'curated.jpg',
      'best.jpg',
    ])
  })
})

describe('formatMunicipalityMeta', () => {
  it('shows only the beach count without blue flags', () => {
    expect(formatMunicipalityMeta(5, 0)).toBe('5 playas')
  })

  it('adds a pluralised blue flag count', () => {
    expect(formatMunicipalityMeta(1, 1)).toBe('1 playa · 1 bandera azul')
    expect(formatMunicipalityMeta(34, 7)).toBe('34 playas · 7 banderas azules')
  })
})
