import { describe, expect, it } from 'vitest'

import type { BeachSearchParams } from './beach-filters'

import { listActiveFilters } from './active-filters'

const lookups = {
  municipalities: [{ name: 'Cartagena' }, { name: 'Lorca' }],
  seas: [{ name: 'Mediterráneo' }],
  services: [{ name: 'Duchas' }, { name: 'Aseos' }],
  activities: [],
  tags: [],
}

describe('listActiveFilters', () => {
  it('returns nothing when no filter is set', () => {
    expect(listActiveFilters({}, lookups)).toEqual([])
  })

  it('labels each filter and removes only that one', () => {
    const filters: BeachSearchParams = {
      municipality: [0, 1],
      services: [1],
      nudist: true,
    }
    const result = listActiveFilters(filters, lookups)

    expect(result.map((f) => f.label)).toEqual([
      'Cartagena',
      'Lorca',
      'Aseos',
      'Nudista',
    ])
    expect(result[0].without.municipality).toEqual([1])
    expect(result[2].without.services).toEqual([])
    expect(result[3].without.nudist).toBeUndefined()
    expect(result[3].without.municipality).toEqual([0, 1])
  })

  it('includes the today and certification filters', () => {
    const result = listActiveFilters(
      { flagGreen: true, blueFlag: true, lifeguard: true },
      lookups,
    )
    expect(result.map((f) => f.label)).toEqual([
      'Bandera verde hoy',
      'Bandera Azul',
      'Con socorrista',
    ])
  })

  it('skips indexes that no longer exist', () => {
    expect(listActiveFilters({ municipality: [9] }, lookups)).toEqual([])
  })
})
