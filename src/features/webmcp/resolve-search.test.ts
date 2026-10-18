import { describe, expect, it } from 'vitest'

import type { Beach } from '@/types/beach'

import type { BeachCatalog } from './resolve-search'

import { buildSearchParams, summarizeBeach } from './resolve-search'
import { parseSearchInput } from './tool-input'

const catalog: BeachCatalog = {
  municipalities: [
    { name: 'Cartagena', id: '30016' },
    { name: 'San Javier', id: '30035' },
    { name: 'Águilas', id: '30003' },
  ],
  seas: [
    { name: 'Mar Mediterráneo', jellyfishRisk: 'low' },
    { name: 'Mar Menor', jellyfishRisk: 'medium' },
  ],
  services: [
    { id: 'duchas', name: 'Duchas', icon: '' },
    { id: 'aseos', name: 'Aseos', icon: '' },
  ],
  activities: [{ id: 'buceo', name: 'Buceo', icon: '' }],
  tags: [{ id: 'cala', name: 'Cala' }],
}

const beach: Beach = {
  code: 'X1',
  name: 'Cala Cortina',
  municipality: 0,
  sea: 0,
  coordinates: [37.58, -0.96],
  soilType: 'arena',
  nudist: false,
  promenade: false,
  anchorageZone: false,
  dogFriendly: false,
  lifeguard: true,
  services: [0, 1, 9],
  activities: [0],
  tags: [0],
  description: '',
  access: '',
  nearby: [],
  orientation: 'S',
  instagramHashtag: '',
  occupancyLevel: 'high',
  accessDifficulty: 'easy',
  certifications: ['blue-flag'],
  length: 250,
  recommendationScore: 80,
}

describe('buildSearchParams', () => {
  it('resolves names to indexes, ignoring accents and case', () => {
    const { params, unresolved } = buildSearchParams(
      parseSearchInput({
        municipality: 'aguilas',
        sea: 'mar menor',
        services: ['duchas', 'ASEOS'],
        activities: ['buceo'],
        tags: ['cala'],
      }),
      catalog,
    )
    expect(params).toEqual({
      municipality: [2],
      sea: [1],
      services: [0, 1],
      activities: [0],
      tags: [0],
    })
    expect(unresolved).toEqual([])
  })

  it('matches municipality INE codes and partial names', () => {
    expect(
      buildSearchParams(parseSearchInput({ municipality: '30035' }), catalog)
        .params.municipality,
    ).toEqual([1])
    expect(
      buildSearchParams(parseSearchInput({ municipality: 'javier' }), catalog)
        .params.municipality,
    ).toEqual([1])
  })

  it('reports unresolved names and omits empty filters', () => {
    const { params, unresolved } = buildSearchParams(
      parseSearchInput({ municipality: 'Madrid', services: ['wifi'] }),
      catalog,
    )
    expect(params).toEqual({})
    expect(unresolved).toEqual(['Madrid', 'wifi'])
  })

  it('passes flags, enums, sort and query through', () => {
    const { params } = buildSearchParams(
      parseSearchInput({
        query: 'cala',
        dogFriendly: true,
        accessDifficulty: 'easy',
        occupancy: 'low',
        sort: 'name',
      }),
      catalog,
    )
    expect(params).toEqual({
      q: 'cala',
      dogFriendly: true,
      accessDifficulty: ['easy'],
      occupancy: ['low'],
      sort: 'name',
    })
  })
})

describe('summarizeBeach', () => {
  it('resolves ids to names and builds the canonical URL', () => {
    const summary = summarizeBeach(beach, catalog)
    expect(summary).toMatchObject({
      name: 'Cala Cortina',
      slug: 'cala-cortina',
      url: 'https://www.playasmurcia.com/playas/cala-cortina',
      municipality: 'Cartagena',
      sea: 'Mar Mediterráneo',
      lengthMeters: 250,
      occupancy: 'Muy concurrida en verano',
      accessDifficulty: 'Acceso fácil',
      lifeguard: true,
      childSafe: false,
      certifications: ['blue-flag'],
      services: ['Duchas', 'Aseos'],
      activities: ['Buceo'],
      tags: ['Cala'],
    })
  })
})
