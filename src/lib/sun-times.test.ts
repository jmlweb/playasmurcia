import { describe, expect, it } from 'vitest'

import {
  facesSummerSunset,
  formatMadridTime,
  getMadridDayUtcMidnight,
  getSunTimes,
} from './sun-times'

// Cartagena harbour
const LAT = 37.6
const LNG = -0.98

const minutesOff = (actual: number, expectedIso: string) =>
  Math.abs(actual - Date.parse(expectedIso)) / 60_000

describe('getSunTimes', () => {
  it('matches the published times for the June solstice in Cartagena', () => {
    const times = getSunTimes(LAT, LNG, Date.UTC(2026, 5, 21))
    expect(times).toBeDefined()
    // timeanddate.com for Cartagena, 21 June 2026: 06:44 and 21:29 CEST
    expect(minutesOff(times!.sunrise, '2026-06-21T04:44:00Z')).toBeLessThan(3)
    expect(minutesOff(times!.sunset, '2026-06-21T19:29:00Z')).toBeLessThan(3)
  })

  it('matches the published times for the December solstice', () => {
    const times = getSunTimes(LAT, LNG, Date.UTC(2026, 11, 21))
    // 08:16 and 17:48 CET
    expect(minutesOff(times!.sunrise, '2026-12-21T07:16:00Z')).toBeLessThan(3)
    expect(minutesOff(times!.sunset, '2026-12-21T16:48:00Z')).toBeLessThan(3)
  })

  it('returns undefined inside the polar night', () => {
    expect(getSunTimes(80, 20, Date.UTC(2026, 11, 21))).toBeUndefined()
  })
})

describe('getMadridDayUtcMidnight', () => {
  it('uses the Madrid calendar day, not the UTC one', () => {
    // 23:30 UTC on 1 July is already 2 July in Madrid
    expect(getMadridDayUtcMidnight(Date.UTC(2026, 6, 1, 23, 30))).toBe(
      Date.UTC(2026, 6, 2),
    )
  })
})

describe('formatMadridTime', () => {
  it('formats as 24-hour Madrid local time', () => {
    expect(formatMadridTime(Date.UTC(2026, 6, 1, 19, 5))).toBe('21:05')
  })
})

describe('facesSummerSunset', () => {
  it('accepts west, north-west and south-west facing shores', () => {
    expect(facesSummerSunset(270)).toBe(true)
    expect(facesSummerSunset(230)).toBe(true)
    expect(facesSummerSunset(355)).toBe(true)
    expect(facesSummerSunset(0)).toBe(true)
  })

  it('rejects shores that face east or south', () => {
    expect(facesSummerSunset(90)).toBe(false)
    expect(facesSummerSunset(180)).toBe(false)
    expect(facesSummerSunset(210)).toBe(false)
    expect(facesSummerSunset(10)).toBe(false)
  })
})
