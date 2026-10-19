import { describe, expect, it } from 'vitest'

import type { Beach, Municipality } from '@/types/beach'

import {
  buildCharacteristicCounts,
  buildMunicipalityNav,
  buildMunicipalityNavWithBlueFlag,
  countBlueFlag,
  sortMunicipalitiesByCoast,
} from './nav-builders'

const municipalities: Municipality[] = [
  { name: 'Cartagena', id: '30016' },
  { name: 'Mazarrón', id: '30025' },
]

function makeBeach(
  overrides: Partial<Beach> & { municipality: number },
): Beach {
  return {
    code: 'TEST',
    name: 'Test Beach',
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
    ...overrides,
  }
}

const beaches: Beach[] = [
  makeBeach({
    code: 'B1',
    name: 'Calblanque',
    municipality: 0,
    certifications: ['blue-flag'],
    accessDifficulty: 'easy',
    childSafe: true,
    lifeguard: true,
    tags: [2, 6],
  }),
  makeBeach({
    code: 'B2',
    name: 'Portús',
    municipality: 0,
    nudist: true,
  }),
  makeBeach({
    code: 'B3',
    name: 'Bolnuevo',
    municipality: 1,
    dogFriendly: true,
    certifications: ['blue-flag'],
  }),
]

describe('nav-builders', () => {
  describe('buildMunicipalityNav', () => {
    it('returns one entry per municipality with beach counts', () => {
      const result = buildMunicipalityNav(beaches, municipalities)
      expect(result).toEqual([
        { name: 'Cartagena', slug: 'cartagena', beachCount: 2 },
        { name: 'Mazarrón', slug: 'mazarron', beachCount: 1 },
      ])
    })

    it('returns zero count for municipality with no beaches', () => {
      const extra: Municipality[] = [
        ...municipalities,
        { name: 'Águilas', id: '30003' },
      ]
      const result = buildMunicipalityNav(beaches, extra)
      expect(result[2]).toEqual({
        name: 'Águilas',
        slug: 'aguilas',
        beachCount: 0,
      })
    })
  })

  describe('buildMunicipalityNavWithBlueFlag', () => {
    it('includes blue flag counts', () => {
      const result = buildMunicipalityNavWithBlueFlag(beaches, municipalities)
      expect(result[0].blueFlagCount).toBe(1)
      expect(result[1].blueFlagCount).toBe(1)
    })
  })

  describe('buildCharacteristicCounts', () => {
    it('returns correct counts for each characteristic', () => {
      const result = buildCharacteristicCounts(beaches)
      const byLabel = new Map(result.map((c) => [c.label, c.count]))
      expect(byLabel.get('Bandera Azul')).toBe(2)
      expect(byLabel.get('Accesibles')).toBe(1)
      expect(byLabel.get('Nudistas')).toBe(1)
      expect(byLabel.get('Para perros')).toBe(1)
      expect(byLabel.get('Familiares')).toBe(1)
    })

    it('returns correct hrefs', () => {
      const result = buildCharacteristicCounts(beaches)
      expect(result[0].href).toBe('/colecciones/bandera-azul')
      expect(result[1].href).toBe('/colecciones/accesibles')
    })
  })

  describe('countBlueFlag', () => {
    it('counts beaches with blue-flag certification', () => {
      expect(countBlueFlag(beaches)).toBe(2)
    })

    it('returns 0 for no blue flags', () => {
      const noFlags = [makeBeach({ municipality: 0 })]
      expect(countBlueFlag(noFlags)).toBe(0)
    })
  })
})

describe('sortMunicipalitiesByCoast', () => {
  it('orders municipalities along the coast, north-east to south-west', () => {
    const items = ['lorca', 'cartagena', 'san-javier', 'aguilas'].map(
      (slug) => ({ slug }),
    )

    expect(
      sortMunicipalitiesByCoast(items).map((item) => item.slug),
    ).toStrictEqual(['san-javier', 'cartagena', 'aguilas', 'lorca'])
  })

  it('puts unknown slugs last and keeps the input intact', () => {
    const items = [{ slug: 'nuevo' }, { slug: 'lorca' }, { slug: 'cartagena' }]

    expect(
      sortMunicipalitiesByCoast(items).map((item) => item.slug),
    ).toStrictEqual(['cartagena', 'lorca', 'nuevo'])
    expect(items.map((item) => item.slug)).toStrictEqual([
      'nuevo',
      'lorca',
      'cartagena',
    ])
  })
})
