import { describe, expect, it } from 'vitest'

import type { Zone } from './zones'

import { buildZoneToday, zoneAnchorId } from './zone-today'

const zone = (id: string, name: string): Zone => ({
  id,
  name,
  kind: 'locality',
  municipalities: [],
})

const groups = [
  {
    zone: zone('calabardina', 'Calabardina'),
    beaches: [{ code: 'a' }, { code: 'b' }],
  },
  { zone: undefined, beaches: [{ code: 'c' }] },
]

describe('zoneAnchorId', () => {
  it('matches the zone section heading ids', () => {
    expect(zoneAnchorId('calabardina')).toBe('zona-calabardina')
    expect(zoneAnchorId(undefined)).toBe('zona-otras')
  })
})

describe('buildZoneToday', () => {
  it('summarizes weather and flags per zone', () => {
    const today = buildZoneToday({
      groups,
      weather: {
        a: {
          temp: 24,
          icon: 'sunny',
          windSpeed: 9,
          observedAt: '2026-11-10T12:00',
        },
        b: {
          temp: 25,
          icon: 'sunny',
          windSpeed: 11,
          observedAt: '2026-11-10T12:15',
        },
      },
      flags: { a: 'VERDE', b: 'SIN BANDERA', c: 'AMARILLA' },
    })

    expect(today.rows).toEqual([
      {
        anchorId: 'zona-calabardina',
        name: 'Calabardina',
        beachCount: 2,
        shownCount: 2,
        weather: {
          temp: { min: 24, max: 25 },
          wind: { min: 9, max: 11 },
          icon: 'sunny',
        },
        flags: { VERDE: 1 },
      },
      {
        anchorId: 'zona-otras',
        name: 'Otras playas',
        beachCount: 1,
        shownCount: 1,
        flags: { AMARILLA: 1 },
      },
    ])
    expect(today.weatherTime).toBe('12:15')
    expect(today.flaggedCount).toBe(2)
  })

  it('marks zones the filters emptied', () => {
    const today = buildZoneToday({
      groups,
      weather: {},
      flags: {},
      shownCodes: new Set(['c']),
    })

    expect(today.rows.map(({ shownCount }) => shownCount)).toEqual([0, 1])
  })

  it('leaves out what no source answered', () => {
    const today = buildZoneToday({ groups, weather: {}, flags: {} })

    expect(today.rows[0]).toEqual({
      anchorId: 'zona-calabardina',
      name: 'Calabardina',
      beachCount: 2,
      shownCount: 2,
    })
    expect(today.weatherTime).toBeUndefined()
    expect(today.flaggedCount).toBe(0)
  })
})
