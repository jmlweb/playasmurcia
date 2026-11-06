import { describe, expect, it } from 'vitest'

import type { BeachFlag } from './beach-status-112'
import type { CardWeather } from './open-meteo'

import beaches from '../../data/beaches.json'
import {
  buildCoastToday,
  CoastSeas,
  coastReferenceCodes,
  countBeachesBySea,
  countFlags,
  formatRange,
  isFlagSeason,
  latestWeatherTime,
  summarizeSeaWeather,
} from './coast-today'
import { SEA_MAR_MENOR, SEA_MEDITERRANEO } from './collections'

const point = (overrides: Partial<CardWeather> = {}): CardWeather => ({
  temp: 20,
  icon: 'sunny',
  windSpeed: 10,
  windDirection: 'E',
  ...overrides,
})

describe('summarizeSeaWeather', () => {
  it('returns nothing without points', () => {
    expect(summarizeSeaWeather([])).toBeUndefined()
  })

  it('reports temperature and wind as ranges across the points', () => {
    const summary = summarizeSeaWeather([
      point({ temp: 18, windSpeed: 26 }),
      point({ temp: 21, windSpeed: 9 }),
    ])

    expect(summary?.temp).toEqual({ min: 18, max: 21 })
    expect(summary?.wind).toEqual({ min: 9, max: 26 })
  })

  it('shows the sky only when every point agrees', () => {
    expect(summarizeSeaWeather([point(), point()])?.icon).toBe('sunny')
    expect(
      summarizeSeaWeather([point(), point({ icon: 'rain' })])?.icon,
    ).toBeUndefined()
  })

  it('omits wind when no point reports it', () => {
    const summary = summarizeSeaWeather([point({ windSpeed: undefined })])

    expect(summary?.wind).toBeUndefined()
  })
})

describe('countFlags', () => {
  it('counts each flag and ignores SIN BANDERA', () => {
    const flags: BeachFlag[] = ['VERDE', 'VERDE', 'ROJA', 'SIN BANDERA']

    expect(countFlags(flags)).toEqual({ VERDE: 2, ROJA: 1 })
  })

  it('returns nothing when no beach has a flag', () => {
    expect(countFlags(['SIN BANDERA'])).toBeUndefined()
    expect(countFlags([])).toBeUndefined()
  })
})

describe('countBeachesBySea', () => {
  it('counts beaches per sea', () => {
    expect(
      countBeachesBySea([
        { sea: SEA_MAR_MENOR },
        { sea: SEA_MEDITERRANEO },
        { sea: SEA_MEDITERRANEO },
      ]),
    ).toEqual({ 'mar-menor': 1, 'mar-mediterraneo': 2 })
  })
})

describe('coastReferenceCodes', () => {
  it('lists each reference beach once', () => {
    const codes = coastReferenceCodes()

    expect(new Set(codes).size).toBe(codes.length)
  })

  it('points at real beaches on the right sea', () => {
    const seaByCode = new Map(beaches.map(({ code, sea }) => [code, sea]))

    for (const { sea, referenceCodes } of CoastSeas) {
      for (const code of referenceCodes) {
        expect(seaByCode.get(code)).toBe(sea)
      }
    }
  })
})

describe('buildCoastToday', () => {
  const [marMenor, mediterraneo] = CoastSeas
  const marMenorCode = marMenor.referenceCodes[0]
  const mediterraneoCode = mediterraneo.referenceCodes[0]

  it('keeps each sea to its own weather and flags', () => {
    const today = buildCoastToday({
      beaches: [
        { code: 'a', sea: marMenor.sea },
        { code: 'b', sea: mediterraneo.sea },
      ],
      weather: new Map([
        [marMenorCode, point({ temp: 19 })],
        [mediterraneoCode, point({ temp: 23 })],
      ]),
      flags: new Map<string, BeachFlag>([
        ['a', 'VERDE'],
        ['b', 'ROJA'],
      ]),
    })

    expect(today.seas['mar-menor']?.weather?.temp.max).toBe(19)
    expect(today.seas['mar-menor']?.flags).toEqual({ VERDE: 1 })
    expect(today.seas['mar-mediterraneo']?.weather?.temp.max).toBe(23)
    expect(today.seas['mar-mediterraneo']?.flags).toEqual({ ROJA: 1 })
  })

  it('takes the newest weather reading and keeps the flag time', () => {
    const today = buildCoastToday({
      beaches: [],
      weather: new Map([
        [marMenorCode, point({ observedAt: '2026-07-14T11:00' })],
        [mediterraneoCode, point({ observedAt: '2026-07-14T11:15' })],
      ]),
      flags: new Map(),
      flagsTime: '11:40',
    })

    expect(today.weatherTime).toBe('11:15')
    expect(today.flagsTime).toBe('11:40')
  })

  it('states no time for a source without data', () => {
    const today = buildCoastToday({
      beaches: [],
      weather: new Map(),
      flags: new Map(),
    })

    expect(today.weatherTime).toBeUndefined()
    expect(today.flagsTime).toBeUndefined()
    expect(today.seas['mar-menor']).toEqual({})
  })
})

describe('latestWeatherTime', () => {
  it('returns the newest time, ignoring points without one', () => {
    expect(
      latestWeatherTime([
        point({ observedAt: '2026-07-14T11:00' }),
        point({ observedAt: '2026-07-14T11:15' }),
        point(),
      ]),
    ).toBe('11:15')
  })

  it('returns nothing when no point has a time', () => {
    expect(latestWeatherTime([point()])).toBeUndefined()
  })
})

describe('isFlagSeason', () => {
  it('covers June to September', () => {
    expect(isFlagSeason(new Date(2026, 5, 1))).toBe(true)
    expect(isFlagSeason(new Date(2026, 8, 30))).toBe(true)
    expect(isFlagSeason(new Date(2026, 4, 31))).toBe(false)
    expect(isFlagSeason(new Date(2026, 9, 1))).toBe(false)
  })
})

describe('formatRange', () => {
  it('collapses equal bounds', () => {
    expect(formatRange({ min: 20, max: 20 })).toBe('20')
  })

  it('joins different bounds with an en dash', () => {
    expect(formatRange({ min: 8, max: 11 })).toBe('8–11')
  })
})
