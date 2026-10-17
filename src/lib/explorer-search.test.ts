import { describe, expect, it } from 'vitest'

import { validateSearch } from './explorer-search'

describe('validateSearch need filters', () => {
  it('accepts boolean and string true flags', () => {
    const result = validateSearch({ dogFriendly: true, lifeguard: 'true' })

    expect(result.dogFriendly).toBe(true)
    expect(result.lifeguard).toBe(true)
    expect(result.nudist).toBeUndefined()
  })

  it('drops false and unknown flag values', () => {
    const result = validateSearch({ dogFriendly: false, childSafe: 'yes' })

    expect(result.dogFriendly).toBeUndefined()
    expect(result.childSafe).toBeUndefined()
  })

  it('keeps only valid access and occupancy levels', () => {
    const result = validateSearch({
      accessDifficulty: ['easy', 'bogus', 'easy'],
      occupancy: 'low',
    })

    expect(result.accessDifficulty).toEqual(['easy'])
    expect(result.occupancy).toEqual(['low'])
  })

  it('returns undefined when no valid level remains', () => {
    expect(validateSearch({ occupancy: ['nope'] }).occupancy).toBeUndefined()
    expect(validateSearch({}).accessDifficulty).toBeUndefined()
  })
})
