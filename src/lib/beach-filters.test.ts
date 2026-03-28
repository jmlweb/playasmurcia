import { describe, expect, it } from 'vitest'

import type { Beach } from '@/types/beach'

import {
  applyFiltersAndSort,
  filterBeaches,
  sortBeaches,
} from './beach-filters'

const makeBeach = (overrides: Partial<Beach> & Pick<Beach, 'name'>): Beach => {
  const { name, ...rest } = overrides
  return {
    code: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    municipality: 0,
    sea: 0,
    coordinates: [37.5, -1.2],
    soilType: 'arena',
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
    orientation: 'sur',
    instagramHashtag: '',
    ...rest,
  }
}

const beaches: Beach[] = [
  makeBeach({
    name: 'Cala Abierta',
    municipality: 0,
    sea: 0,
    services: [0, 1],
    activities: [0],
    tags: [0, 2],
    length: 300,
  }),
  makeBeach({
    name: 'Playa de Bolnuevo',
    municipality: 3,
    sea: 0,
    services: [0],
    activities: [0, 1],
    tags: [1],
    length: 1200,
    occupancyLevel: 'high',
  }),
  makeBeach({
    name: 'Las Salinas',
    municipality: 4,
    sea: 1,
    services: [0, 2],
    activities: [2],
    tags: [2, 3],
    length: 800,
    occupancyLevel: 'low',
  }),
  makeBeach({
    name: 'Playa Honda',
    municipality: 6,
    sea: 1,
    services: [],
    activities: [],
    tags: [],
    length: 500,
    occupancyLevel: 'medium',
  }),
  makeBeach({
    name: 'Calblanque',
    municipality: 0,
    sea: 0,
    services: [1, 3],
    activities: [0, 3],
    length: 2000,
    occupancyLevel: 'low',
  }),
]

describe('filterBeaches', () => {
  it('returns all beaches when no filters', () => {
    expect(filterBeaches(beaches, {})).toHaveLength(5)
  })

  it('filters by text search (case insensitive)', () => {
    const result = filterBeaches(beaches, { q: 'cala' })
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Cala Abierta')
  })

  it('filters by text search (accent insensitive)', () => {
    const result = filterBeaches(beaches, { q: 'salinas' })
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Las Salinas')
  })

  it('filters by municipality', () => {
    const result = filterBeaches(beaches, { municipality: [0] })
    expect(result).toHaveLength(2)
    expect(result.map((b) => b.name)).toContain('Cala Abierta')
    expect(result.map((b) => b.name)).toContain('Calblanque')
  })

  it('filters by multiple municipalities', () => {
    const result = filterBeaches(beaches, { municipality: [0, 3] })
    expect(result).toHaveLength(3)
  })

  it('filters by sea', () => {
    const result = filterBeaches(beaches, { sea: [1] })
    expect(result).toHaveLength(2)
    expect(result.map((b) => b.name)).toContain('Las Salinas')
    expect(result.map((b) => b.name)).toContain('Playa Honda')
  })

  it('filters by services (all must match)', () => {
    const result = filterBeaches(beaches, { services: [0, 1] })
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Cala Abierta')
  })

  it('filters by activities (all must match)', () => {
    const result = filterBeaches(beaches, { activities: [0, 1] })
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Playa de Bolnuevo')
  })

  it('filters by tags (all must match)', () => {
    const result = filterBeaches(beaches, { tags: [2, 3] })
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Las Salinas')
  })

  it('returns empty array when no beaches match', () => {
    const result = filterBeaches(beaches, { q: 'playaxyz123' })
    expect(result).toHaveLength(0)
  })

  it('combines multiple filters', () => {
    const result = filterBeaches(beaches, { municipality: [0], sea: [0] })
    expect(result).toHaveLength(2)
  })

  it('excludes beaches without tags when filtering by tag', () => {
    const result = filterBeaches(beaches, { tags: [0] })
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Cala Abierta')
  })

  it('ignores empty filter arrays', () => {
    const result = filterBeaches(beaches, {
      municipality: [],
      sea: [],
      services: [],
    })
    expect(result).toHaveLength(5)
  })
})

describe('sortBeaches', () => {
  it('sorts by name A-Z by default', () => {
    const result = sortBeaches(beaches, 'name')
    expect(result[0].name).toBe('Cala Abierta')
    expect(result[1].name).toBe('Calblanque')
  })

  it('sorts by municipality index', () => {
    const result = sortBeaches(beaches, 'municipality')
    expect(result[0].municipality).toBeLessThanOrEqual(result[1].municipality)
    expect(result[1].municipality).toBeLessThanOrEqual(result[2].municipality)
  })

  it('sorts by length descending (longest first)', () => {
    const result = sortBeaches(beaches, 'length')
    expect(result[0].length).toBe(2000)
    expect(result[1].length).toBe(1200)
  })

  it('places beaches without length at end', () => {
    const withNoLength = [...beaches, makeBeach({ name: 'Sin Longitud' })]
    const result = sortBeaches(withNoLength, 'length')
    expect(result[result.length - 1].name).toBe('Sin Longitud')
  })

  it('sorts by occupancy (low < medium < high)', () => {
    const result = sortBeaches(beaches, 'occupancy')
    const withOccupancy = result.filter((b) => b.occupancyLevel)
    expect(withOccupancy[0].occupancyLevel).toBe('low')
    expect(withOccupancy[withOccupancy.length - 1].occupancyLevel).toBe('high')
  })

  it('does not mutate original array', () => {
    const original = [...beaches]
    sortBeaches(beaches, 'name')
    expect(beaches).toEqual(original)
  })
})

describe('applyFiltersAndSort', () => {
  it('filters and sorts in one step', () => {
    const result = applyFiltersAndSort(beaches, { sea: [0], sort: 'length' })
    expect(result.every((b) => b.sea === 0)).toBe(true)
    expect(result[0].length).toBeGreaterThanOrEqual(
      result[result.length - 1].length ?? 0,
    )
  })
})
