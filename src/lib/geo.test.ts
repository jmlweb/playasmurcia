import { describe, expect, it } from 'vitest'

import { formatDistance, haversineKm } from './geo'

describe('haversineKm', () => {
  it('is zero for the same point', () => {
    expect(haversineKm([37.6, -0.98], [37.6, -0.98])).toBe(0)
  })

  it('measures Murcia to Cartagena at roughly 40 km', () => {
    const km = haversineKm([37.9922, -1.1307], [37.6257, -0.9966])
    expect(km).toBeGreaterThan(38)
    expect(km).toBeLessThan(44)
  })

  it('is symmetric', () => {
    const a: [number, number] = [37.7, -0.8]
    const b: [number, number] = [37.5, -1.3]
    expect(haversineKm(a, b)).toBeCloseTo(haversineKm(b, a), 10)
  })
})

describe('formatDistance', () => {
  it.each([
    [0.04, '0 m'],
    [0.46, '500 m'],
    [3.26, '3,3 km'],
    [12.4, '12 km'],
  ])('formats %s km as %s', (km, expected) => {
    expect(formatDistance(km)).toBe(expected)
  })
})
