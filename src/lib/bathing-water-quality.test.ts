import { describe, expect, it } from 'vitest'

import type { BathingWaterPoint } from './bathing-water-quality'

import {
  MAX_SAMPLING_POINT_DISTANCE_M,
  matchBathingWater,
  toWaterQualityClass,
} from './bathing-water-quality'

// About 111 m per 0.001 degrees of latitude.
const BEACH: readonly [number, number] = [37.642, -0.7588]

const point = (overrides: Partial<BathingWaterPoint>): BathingWaterPoint => ({
  id: 'ES620M0161611',
  name: 'PLAYA MAR DE CRISTAL PM1',
  latitude: BEACH[0],
  longitude: BEACH[1],
  qualityStatus: 'Excellent',
  profileUrl: 'https://nayadeciudadano.sanidad.gob.es/profile/16890',
  ...overrides,
})

describe('toWaterQualityClass', () => {
  it('maps the four Directive 2006/7/EC classes', () => {
    expect(toWaterQualityClass('Excellent')).toBe('excellent')
    expect(toWaterQualityClass('Good')).toBe('good')
    expect(toWaterQualityClass('Sufficient')).toBe('sufficient')
    expect(toWaterQualityClass('Poor')).toBe('poor')
  })

  it('gives no class for unclassified or missing statuses', () => {
    expect(toWaterQualityClass('Not classified')).toBeUndefined()
    expect(toWaterQualityClass(null)).toBeUndefined()
    expect(toWaterQualityClass('Closed')).toBeUndefined()
  })
})

describe('matchBathingWater', () => {
  it('gives the official class and season of a sampling point at the beach', () => {
    expect(matchBathingWater(BEACH, [point({})], 2025)).toEqual({
      waterQuality: 'excellent',
      waterQualitySource: {
        season: 2025,
        samplingPointId: 'ES620M0161611',
        samplingPointName: 'PLAYA MAR DE CRISTAL PM1',
        distanceMeters: 0,
        profileUrl: 'https://nayadeciudadano.sanidad.gob.es/profile/16890',
      },
    })
  })

  it('picks the nearest classified point', () => {
    const near = point({ id: 'ES620NEAR', latitude: BEACH[0] + 0.001 })
    const far = point({
      id: 'ES620FAR',
      latitude: BEACH[0] + 0.003,
      qualityStatus: 'Good',
    })
    const match = matchBathingWater(BEACH, [far, near], 2025)
    expect(match?.waterQualitySource.samplingPointId).toBe('ES620NEAR')
    expect(match?.waterQualitySource.distanceMeters).toBe(111)
  })

  it('accepts a point at the distance limit and rejects one beyond it', () => {
    const metresPerDegree = 111_195
    const atLimit = point({
      latitude:
        BEACH[0] + (MAX_SAMPLING_POINT_DISTANCE_M - 1) / metresPerDegree,
    })
    const beyond = point({
      latitude:
        BEACH[0] + (MAX_SAMPLING_POINT_DISTANCE_M + 1) / metresPerDegree,
    })
    expect(matchBathingWater(BEACH, [atLimit], 2025)).toBeDefined()
    expect(matchBathingWater(BEACH, [beyond], 2025)).toBeUndefined()
  })

  it('gives no class when no sampling point is close enough', () => {
    expect(
      matchBathingWater(BEACH, [point({ latitude: BEACH[0] + 0.02 })], 2025),
    ).toBeUndefined()
  })

  it('skips unclassified points instead of guessing', () => {
    const unclassified = point({ qualityStatus: 'Not classified' })
    expect(matchBathingWater(BEACH, [unclassified], 2025)).toBeUndefined()
  })

  it('ignores sampling points outside the Región de Murcia', () => {
    const alicante = point({ id: 'ES521M099927' })
    const almeria = point({ id: 'ES611M0351301' })
    expect(matchBathingWater(BEACH, [alicante, almeria], 2025)).toBeUndefined()
  })

  it('omits the profile link when the point has none', () => {
    const match = matchBathingWater(BEACH, [point({ profileUrl: null })], 2025)
    expect(match?.waterQualitySource).not.toHaveProperty('profileUrl')
  })
})
