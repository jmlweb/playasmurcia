import { describe, expect, it } from 'vitest'

import { seasonalOccupancy } from './occupancy'

describe('seasonalOccupancy', () => {
  it('returns the stored level in July and August', () => {
    expect(seasonalOccupancy('high', new Date(2026, 6, 15))).toBe('high')
    expect(seasonalOccupancy('medium', new Date(2026, 7, 1))).toBe('medium')
  })

  it('caps high at medium in June and September', () => {
    expect(seasonalOccupancy('high', new Date(2026, 5, 10))).toBe('medium')
    expect(seasonalOccupancy('low', new Date(2026, 8, 10))).toBe('low')
  })

  it('returns undefined off-season', () => {
    expect(seasonalOccupancy('high', new Date(2026, 9, 18))).toBeUndefined()
    expect(seasonalOccupancy('low', new Date(2026, 0, 5))).toBeUndefined()
  })
})
