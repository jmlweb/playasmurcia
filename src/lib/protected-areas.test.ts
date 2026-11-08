import { describe, expect, it } from 'vitest'

import beaches from '../../data/beaches.json'
import { getProtectedAreas, isMarineSite } from './protected-areas'

describe('getProtectedAreas', () => {
  it('puts Playa de Calblanque in the regional park and its Natura 2000 site', () => {
    const areas = getProtectedAreas('590')
    expect(areas?.regional.map((s) => s.figure)).toEqual(['Parque Regional'])
    expect(areas?.natura2000.map((s) => s.code)).toContain('ES6200001')
  })

  it('separates the sea in front of the beach from the land sites', () => {
    const areas = getProtectedAreas('590')
    const marine = areas?.natura2000.filter(isMarineSite).map((s) => s.code)
    expect(marine).toEqual(['ES6200029'])
  })

  it('only names beach codes that exist and covers most of the coast', () => {
    const codes = new Set(beaches.map((b) => b.code))
    const withAreas = beaches.filter((b) => getProtectedAreas(b.code))
    expect(withAreas.length).toBeGreaterThan(120)
    withAreas.forEach((b) => {
      expect(codes.has(b.code)).toBe(true)
    })
    // Bolnuevo: the Gredas monument sits by the sand, so the buffer catches it
    expect(getProtectedAreas('646')?.regional.map((s) => s.name)).toEqual([
      'Gredas de Bolnuevo',
    ])
  })
})
