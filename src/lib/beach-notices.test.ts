import { describe, expect, it } from 'vitest'

import beaches from '../../data/beaches.json'
import { getAccessRestriction, getSmokeFreeEntry } from './beach-notices'

const codes = new Set(beaches.map((beach) => beach.code))

describe('getSmokeFreeEntry', () => {
  it('lists the 16 spaces of the regional network against real beach codes', () => {
    const listed = beaches.filter((beach) => getSmokeFreeEntry(beach.code))
    expect(listed).toHaveLength(16)
  })

  it('records the stretch when only part of the beach is covered', () => {
    expect(getSmokeFreeEntry('533')?.stretch).toBe('la zona deportiva')
    expect(getSmokeFreeEntry('581')?.stretch).toBeUndefined()
    expect(getSmokeFreeEntry('000')).toBeUndefined()
  })
})

describe('getAccessRestriction', () => {
  it('covers every Calblanque, Calnegre and Cuatro Calas beach with a sourced rule', () => {
    const affected = beaches.filter((beach) =>
      ['calblanque', 'puntas-de-calnegre', 'cuatro-calas'].includes(
        beach.zone ?? '',
      ),
    )
    affected.forEach((beach) => {
      const rule = getAccessRestriction(beach.code)
      expect(rule?.year, beach.name).toBe(2026)
      expect(rule?.sourceUrl, beach.name).toMatch(/^https:\/\//)
    })
  })

  it('only names beach codes that exist', () => {
    const restricted = beaches.filter((beach) =>
      getAccessRestriction(beach.code),
    )
    expect(restricted.length).toBe(23)
    restricted.forEach((beach) => {
      expect(codes.has(beach.code)).toBe(true)
    })
  })
})
