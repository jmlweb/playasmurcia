import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { AemetSkyPeriod, AemetWindPeriod } from './aemet'
import { fetchAemetForecast, getDaySkyDescription, getDayWind } from './aemet'

// ---------------------------------------------------------------------------
// getDaySkyDescription
// ---------------------------------------------------------------------------

describe('getDaySkyDescription', () => {
  it('returns null for empty array', () => {
    expect(getDaySkyDescription([])).toBeNull()
  })

  it('prefers 00-24 period', () => {
    const periods: AemetSkyPeriod[] = [
      { periodo: '00-12', descripcion: 'Poco nuboso', value: '11' },
      { periodo: '00-24', descripcion: 'Despejado', value: '11n' },
      { periodo: '12-24', descripcion: 'Cubierto', value: '16' },
    ]
    expect(getDaySkyDescription(periods)?.descripcion).toBe('Despejado')
  })

  it('falls back to 00-12 when no 00-24', () => {
    const periods: AemetSkyPeriod[] = [
      { periodo: '12-24', descripcion: 'Cubierto', value: '16' },
      { periodo: '00-12', descripcion: 'Poco nuboso', value: '11' },
    ]
    expect(getDaySkyDescription(periods)?.descripcion).toBe('Poco nuboso')
  })

  it('falls back to first entry when no 00-24 or 00-12', () => {
    const periods: AemetSkyPeriod[] = [
      { periodo: '12-24', descripcion: 'Cubierto', value: '16' },
    ]
    expect(getDaySkyDescription(periods)?.descripcion).toBe('Cubierto')
  })
})

// ---------------------------------------------------------------------------
// getDayWind
// ---------------------------------------------------------------------------

describe('getDayWind', () => {
  it('returns null for empty array', () => {
    expect(getDayWind([])).toBeNull()
  })

  it('prefers 00-24 period', () => {
    const periods: AemetWindPeriod[] = [
      { periodo: '00-12', velocidad: 20, direccion: 'N' },
      { periodo: '00-24', velocidad: 15, direccion: 'NE' },
      { periodo: '12-24', velocidad: 25, direccion: 'S' },
    ]
    expect(getDayWind(periods)?.velocidad).toBe(15)
    expect(getDayWind(periods)?.direccion).toBe('NE')
  })

  it('falls back to 00-12 when no 00-24', () => {
    const periods: AemetWindPeriod[] = [
      { periodo: '12-24', velocidad: 25, direccion: 'S' },
      { periodo: '00-12', velocidad: 10, direccion: 'N' },
    ]
    expect(getDayWind(periods)?.direccion).toBe('N')
  })

  it('falls back to first entry otherwise', () => {
    const periods: AemetWindPeriod[] = [
      { periodo: '06-12', velocidad: 5, direccion: 'E' },
    ]
    expect(getDayWind(periods)?.direccion).toBe('E')
  })
})

// ---------------------------------------------------------------------------
// fetchAemetForecast
// ---------------------------------------------------------------------------

const MOCK_RAW_FORECAST = [
  {
    elaborado: '2026-03-27T00:00:00',
    prediccion: {
      dia: [
        {
          fecha: 1743033600000,
          estadoCielo: [
            { periodo: '00-24', descripcion: 'Despejado', value: '11n' },
          ],
          viento: [{ periodo: '00-24', velocidad: 15, direccion: 'NE' }],
          oleaje: [
            { periodo: '00-24', descripcion: 'Marejadilla', value: '2' },
          ],
          tMaxima: 22,
          tMinima: 16,
          indiceUV: 7,
          sTermica: { tMaxima: 23, tMinima: 15 },
        },
      ],
    },
  },
]

describe('fetchAemetForecast', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns null when apiKey is empty', async () => {
    global.fetch = vi.fn()
    const result = await fetchAemetForecast('TEST_ID_EMPTY', '')
    // With empty key the fetch still fires; simulate network rejection to ensure null
    expect(result).toBeNull()
  })

  it('returns null when meta fetch fails', async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({ ok: false, json: async () => ({}) })
    const result = await fetchAemetForecast('TEST_ID_FAIL', 'key123')
    expect(result).toBeNull()
  })

  it('returns null when meta estado is not 200', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ estado: 429, descripcion: 'Rate limit' }),
    })
    const result = await fetchAemetForecast('TEST_ID_RATE', 'key123')
    expect(result).toBeNull()
  })

  it('returns null when data fetch fails', async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ estado: 200, datos: 'https://example.com/data' }),
      })
      .mockResolvedValueOnce({ ok: false, json: async () => [] })
    const result = await fetchAemetForecast('TEST_ID_DATA_FAIL', 'key123')
    expect(result).toBeNull()
  })

  it('parses a valid forecast response', async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ estado: 200, datos: 'https://example.com/data' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => MOCK_RAW_FORECAST,
      })
    const result = await fetchAemetForecast('TEST_ID_OK', 'key123')
    expect(result).not.toBeNull()
    expect(result?.elaborado).toBe('2026-03-27T00:00:00')
    expect(result?.dias).toHaveLength(1)
    expect(result?.dias[0].tMaxima).toBe(22)
    expect(result?.dias[0].indiceUV).toBe(7)
  })

  it('returns cached value on second call without fetching again', async () => {
    const mockFetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ estado: 200, datos: 'https://example.com/data' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => MOCK_RAW_FORECAST,
      })
    global.fetch = mockFetch

    const result1 = await fetchAemetForecast('TEST_ID_CACHE', 'key123')
    const result2 = await fetchAemetForecast('TEST_ID_CACHE', 'key123')

    // fetch should have been called exactly twice (meta + data) for the first call
    expect(mockFetch).toHaveBeenCalledTimes(2)
    expect(result1).toEqual(result2)
  })

  it('returns null and caches null when fetch throws', async () => {
    global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'))
    const result = await fetchAemetForecast('TEST_ID_THROW', 'key123')
    expect(result).toBeNull()
  })
})
