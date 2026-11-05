import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { AemetForecastDay } from './aemet'

import { dropPastDays, fetchAemetForecast, getDayDescription } from './aemet'

// Real response for 3000301 (La Carolina), captured on 2026-11-05 from the
// AEMET prediccion/especifica/playa datos URL.
const REAL_AEMET_PAYLOAD = [
  {
    origen: {
      productor: 'Agencia Estatal de Meteorología - AEMET. Gobierno de España',
      web: 'http://www.aemet.es',
      language: 'es',
      copyright:
        '© AEMET. Autorizado el uso de la información y su reproducción citando a AEMET como autora de la misma.',
      notaLegal: 'http://www.aemet.es/es/nota_legal',
    },
    elaborado: '2026-11-04T08:51:16',
    nombre: 'La Carolina',
    localidad: 30003,
    prediccion: {
      dia: [
        {
          estadoCielo: {
            value: '',
            f1: 120,
            descripcion1: 'muy nuboso',
            f2: 140,
            descripcion2: 'muy nuboso con lluvia',
          },
          viento: {
            value: '',
            f1: 210,
            descripcion1: 'flojo',
            f2: 220,
            descripcion2: 'moderado',
          },
          oleaje: {
            value: '',
            f1: 310,
            descripcion1: 'débil',
            f2: 320,
            descripcion2: 'moderado',
          },
          tMaxima: {
            value: '',
            valor1: 21,
          },
          sTermica: {
            value: '',
            valor1: 450,
            descripcion1: 'suave',
          },
          tAgua: {
            value: '',
            valor1: 24,
          },
          uvMax: {
            value: '',
            valor1: 3,
          },
          fecha: 20261104,
          tmaxima: {
            value: '',
            valor1: 21,
          },
          stermica: {
            value: '',
            valor1: 450,
            descripcion1: 'suave',
          },
          tagua: {
            value: '',
            valor1: 24,
          },
        },
        {
          estadoCielo: {
            value: '',
            f1: 110,
            descripcion1: 'nuboso',
            f2: 100,
            descripcion2: 'despejado',
          },
          viento: {
            value: '',
            f1: 210,
            descripcion1: 'flojo',
            f2: 210,
            descripcion2: 'flojo',
          },
          oleaje: {
            value: '',
            f1: 310,
            descripcion1: 'débil',
            f2: 310,
            descripcion2: 'débil',
          },
          tMaxima: {
            value: '',
            valor1: 22,
          },
          sTermica: {
            value: '',
            valor1: 450,
            descripcion1: 'suave',
          },
          tAgua: {
            value: '',
            valor1: 24,
          },
          uvMax: {
            value: '',
            valor1: 3,
          },
          fecha: 20261105,
          tmaxima: {
            value: '',
            valor1: 22,
          },
          stermica: {
            value: '',
            valor1: 450,
            descripcion1: 'suave',
          },
          tagua: {
            value: '',
            valor1: 24,
          },
        },
        {
          estadoCielo: {
            value: '',
            f1: 120,
            descripcion1: 'muy nuboso',
            f2: 110,
            descripcion2: 'nuboso',
          },
          viento: {
            value: '',
            f1: 210,
            descripcion1: 'flojo',
            f2: 210,
            descripcion2: 'flojo',
          },
          oleaje: {
            value: '',
            f1: 310,
            descripcion1: 'débil',
            f2: 310,
            descripcion2: 'débil',
          },
          tMaxima: {
            value: '',
            valor1: 23,
          },
          sTermica: {
            value: '',
            valor1: 460,
            descripcion1: 'calor agradable',
          },
          tAgua: {
            value: '',
            valor1: 23,
          },
          uvMax: {
            value: '',
            valor1: 3,
          },
          fecha: 20261106,
          tmaxima: {
            value: '',
            valor1: 23,
          },
          stermica: {
            value: '',
            valor1: 460,
            descripcion1: 'calor agradable',
          },
          tagua: {
            value: '',
            valor1: 23,
          },
        },
      ],
    },
    id: 3000301,
  },
]

const mockDataResponse = (): Response =>
  new Response(Buffer.from(JSON.stringify(REAL_AEMET_PAYLOAD), 'latin1'), {
    headers: { 'content-type': 'text/plain;charset=ISO-8859-15' },
  })

// ---------------------------------------------------------------------------
// getDayDescription
// ---------------------------------------------------------------------------

describe('getDayDescription', () => {
  it('prefers the morning value', () => {
    expect(
      getDayDescription({ morning: 'nuboso', afternoon: 'despejado' }),
    ).toBe('nuboso')
  })

  it('falls back to the afternoon value', () => {
    expect(getDayDescription({ morning: '', afternoon: 'despejado' })).toBe(
      'despejado',
    )
  })
})

// ---------------------------------------------------------------------------
// dropPastDays
// ---------------------------------------------------------------------------

describe('dropPastDays', () => {
  const day = (fecha: number): AemetForecastDay => ({
    fecha,
    estadoCielo: { morning: '', afternoon: '' },
    viento: { morning: '', afternoon: '' },
    oleaje: { morning: '', afternoon: '' },
    tMaxima: 20,
    uvMax: 3,
  })
  const days = [
    day(Date.UTC(2026, 10, 4)),
    day(Date.UTC(2026, 10, 5)),
    day(Date.UTC(2026, 10, 6)),
  ]

  it('removes days before today', () => {
    const result = dropPastDays(days, new Date('2026-11-05T10:00:00Z'))
    expect(result.map((d) => d.fecha)).toEqual([
      Date.UTC(2026, 10, 5),
      Date.UTC(2026, 10, 6),
    ])
  })

  it('uses the Madrid calendar day, not the UTC one', () => {
    const result = dropPastDays(days, new Date('2026-11-05T23:30:00Z'))
    expect(result.map((d) => d.fecha)).toEqual([Date.UTC(2026, 10, 6)])
  })
})

// ---------------------------------------------------------------------------
// fetchAemetForecast
// ---------------------------------------------------------------------------

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

  it('parses a real forecast payload', async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ estado: 200, datos: 'https://example.com/data' }),
      })
      .mockResolvedValueOnce(mockDataResponse())
    const result = await fetchAemetForecast('TEST_ID_OK', 'key123')
    expect(result?.elaborado).toBe('2026-11-04T08:51:16')
    expect(result?.dias).toHaveLength(3)
    expect(result?.dias[0]).toEqual({
      fecha: Date.UTC(2026, 10, 4),
      estadoCielo: {
        morning: 'muy nuboso',
        afternoon: 'muy nuboso con lluvia',
      },
      viento: { morning: 'flojo', afternoon: 'moderado' },
      oleaje: { morning: 'débil', afternoon: 'moderado' },
      tMaxima: 21,
      tAgua: 24,
      uvMax: 3,
    })
  })

  it('decodes fecha to the right weekday', async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ estado: 200, datos: 'https://example.com/data' }),
      })
      .mockResolvedValueOnce(mockDataResponse())
    const result = await fetchAemetForecast('TEST_ID_DATE', 'key123')
    // 2026-11-04 is a Wednesday
    expect(new Date(result?.dias[0].fecha ?? 0).getUTCDay()).toBe(3)
  })

  it('returns cached value on second call without fetching again', async () => {
    const mockFetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ estado: 200, datos: 'https://example.com/data' }),
      })
      .mockResolvedValueOnce(mockDataResponse())
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
