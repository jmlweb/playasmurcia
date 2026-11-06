import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

import {
  formatBeachLocation,
  getZone,
  groupBeachesByZone,
  resolveBeachZone,
  shouldGroupByZone,
  zoneFromItremLabel,
  zones,
} from './zones'

type JsonBeach = { code: string; municipality: number; zone?: string }

type ItremSnapshot = {
  withoutPage: string[]
  labels: Record<string, string | null>
}

const readJson = <T>(path: string): T =>
  JSON.parse(readFileSync(path, 'utf8')) as T

const beaches = readJson<JsonBeach[]>('data/beaches.json')
const snapshot = readJson<ItremSnapshot>('data/source/itrem-localities.json')
const curation = readJson<{
  itremLabels: Record<string, string | null>
  unresolved: Record<string, string>
}>('data/zones.json')

const rawLabels = [
  ...new Set(
    Object.values(snapshot.labels).filter(
      (label): label is string => label !== null,
    ),
  ),
]

describe('zone list', () => {
  it('has unique ids', () => {
    const ids = zones.map((zone) => zone.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('keeps Calblanque apart from La Manga', () => {
    expect(getZone('calblanque')).toMatchObject({
      name: 'Calblanque',
      kind: 'area',
    })
    expect(getZone('la-manga')?.kind).toBe('area')
    expect(getZone('cabo-de-palos')?.kind).toBe('locality')
  })

  it('lets La Manga span Cartagena (0) and San Javier (4)', () => {
    expect(getZone('la-manga')?.municipalities).toEqual([4, 0])
  })

  it('restores the diacritics ITREM drops', () => {
    expect(getZone('lo-pagan')?.name).toBe('Lo Pagán')
    expect(getZone('la-azohia')?.name).toBe('La Azohía')
    expect(getZone('portman')?.name).toBe('Portmán')
  })
})

describe('zoneFromItremLabel', () => {
  it('normalizes every label in the ITREM snapshot', () => {
    expect(rawLabels.length).toBe(36)
    expect(Object.keys(curation.itremLabels).sort()).toEqual(
      [...rawLabels].sort(),
    )
    for (const label of rawLabels) {
      const zoneId = zoneFromItremLabel(label)
      if (zoneId !== null) expect(getZone(zoneId)).toBeDefined()
    }
  })

  it('maps localities and tourism areas', () => {
    expect(zoneFromItremLabel('LO PAGAN (San Pedro del Pinatar)')).toBe(
      'lo-pagan',
    )
    expect(zoneFromItremLabel('San Javier, LA MANGA DEL MAR MENOR')).toBe(
      'la-manga',
    )
    expect(zoneFromItremLabel('Cartagena, LA MANGA DEL MAR MENOR')).toBe(
      'la-manga',
    )
    expect(zoneFromItremLabel('COPE (Águilas)')).toBe('cabo-cope')
  })

  it('returns null for a label that only names the municipality', () => {
    expect(zoneFromItremLabel('Mazarrón')).toBeNull()
    expect(zoneFromItremLabel(null)).toBeNull()
  })

  it('throws on a label nobody has curated yet', () => {
    expect(() => zoneFromItremLabel('NUEVA ZONA (Cartagena)')).toThrow(
      /NUEVA ZONA/,
    )
  })
})

describe('resolveBeachZone', () => {
  it('gives each of the 193 beaches a zone or an unresolved reason', () => {
    expect(beaches.length).toBe(193)
    for (const beach of beaches) {
      const result = resolveBeachZone(beach.code, snapshot)
      if ('zone' in result) {
        expect(beach.zone, beach.code).toBe(result.zone)
        expect(curation.unresolved[beach.code]).toBeUndefined()
      } else {
        expect(beach.zone, beach.code).toBeUndefined()
        expect(result.unresolved.length).toBeGreaterThan(0)
      }
    }
  })

  it('reviews every gap by hand instead of falling back to a default', () => {
    const gaps = beaches.filter(
      ({ code }) => zoneFromItremLabel(snapshot.labels[code] ?? null) === null,
    )
    expect(gaps.length).toBe(60)
    for (const { code } of gaps) {
      const result = resolveBeachZone(code, snapshot)
      expect(result.source, code).not.toBe('itrem')
    }
  })

  it('overrides ITREM where it lumps Calblanque into La Manga', () => {
    expect(snapshot.labels['590']).toBe('Cartagena, LA MANGA DEL MAR MENOR')
    expect(resolveBeachZone('590', snapshot)).toMatchObject({
      zone: 'calblanque',
      source: 'manual',
    })
  })

  it('places each beach in a zone of its own municipality', () => {
    for (const beach of beaches) {
      if (!beach.zone) continue
      expect(getZone(beach.zone)?.municipalities, beach.code).toContain(
        beach.municipality,
      )
    }
  })
})

describe('groupBeachesByZone', () => {
  it('orders groups by the zone list and puts beaches without zone last', () => {
    const groups = groupBeachesByZone([
      { code: 'a', zone: 'isla-plana' },
      { code: 'b' },
      { code: 'c', zone: 'cabo-de-palos' },
      { code: 'd', zone: 'isla-plana' },
    ])
    expect(
      groups.map(({ zone, beaches }) => [
        zone?.id,
        beaches.map(({ code }) => code),
      ]),
    ).toEqual([
      ['cabo-de-palos', ['c']],
      ['isla-plana', ['a', 'd']],
      [undefined, ['b']],
    ])
  })

  it('treats an unknown zone id as no zone', () => {
    const groups = groupBeachesByZone([{ code: 'a', zone: 'nowhere' }])
    expect(groups).toEqual([
      { zone: undefined, beaches: [{ code: 'a', zone: 'nowhere' }] },
    ])
  })
})

describe('shouldGroupByZone', () => {
  it('groups when the beaches fall into two or more groups', () => {
    expect(
      shouldGroupByZone([{ zone: 'los-alcazares' }, { zone: 'los-narejos' }]),
    ).toBe(true)
    expect(shouldGroupByZone([{ zone: 'portman' }, {}])).toBe(true)
  })

  it('keeps a flat list for a single zone or no beaches', () => {
    expect(shouldGroupByZone([{ zone: 'portman' }, { zone: 'portman' }])).toBe(
      false,
    )
    expect(shouldGroupByZone([])).toBe(false)
  })
})

describe('formatBeachLocation', () => {
  it('joins zone and municipality', () => {
    expect(formatBeachLocation('isla-plana', 'Cartagena')).toBe(
      'Isla Plana · Cartagena',
    )
  })

  it('shows the municipality alone when there is no zone or it repeats the name', () => {
    expect(formatBeachLocation(undefined, 'Cartagena')).toBe('Cartagena')
    expect(formatBeachLocation('los-alcazares', 'Los Alcázares')).toBe(
      'Los Alcázares',
    )
  })
})
