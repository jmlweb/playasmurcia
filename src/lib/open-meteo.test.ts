import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  fetchBatchCardWeather,
  fetchMarineWeather,
  fetchOpenMeteoForecast,
  parseOpenMeteoDate,
} from './open-meteo'

const beaches = [
  { code: 'TEST_TIMEOUT_A', coordinates: [37.6, -0.8] as [number, number] },
  { code: 'TEST_TIMEOUT_B', coordinates: [37.7, -0.9] as [number, number] },
]

describe('fetchBatchCardWeather', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns an empty map when the upstream request times out', async () => {
    vi.spyOn(AbortSignal, 'timeout').mockReturnValue(AbortSignal.abort())
    global.fetch = vi
      .fn()
      .mockRejectedValue(new DOMException('Timed out', 'TimeoutError'))

    const result = await fetchBatchCardWeather(beaches)

    expect(result.size).toBe(0)
  })

  it('passes a timeout signal to the upstream request', async () => {
    const timeoutSignal = AbortSignal.abort()
    vi.spyOn(AbortSignal, 'timeout').mockReturnValue(timeoutSignal)
    global.fetch = vi.fn().mockResolvedValue({ ok: false })

    await fetchBatchCardWeather(beaches)

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ signal: timeoutSignal }),
    )
  })

  it('splits many unique coordinates into several requests', async () => {
    const many = Array.from({ length: 120 }, (_, i) => ({
      code: `TEST_CHUNK_${i}`,
      coordinates: [37 + i / 100, -0.5] as [number, number],
    }))
    global.fetch = vi.fn().mockResolvedValue({ ok: false })

    await fetchBatchCardWeather(many)

    expect(global.fetch).toHaveBeenCalledTimes(3)
  })

  it('keeps weather from chunks that succeed when another fails', async () => {
    const many = Array.from({ length: 60 }, (_, i) => ({
      code: `TEST_PARTIAL_${i}`,
      // Own longitude: successful chunks stay cached for the later tests
      coordinates: [38 + i / 100, -0.6] as [number, number],
    }))
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () =>
          Array.from({ length: 50 }, () => ({
            current: {
              temperature_2m: 21.4,
              weather_code: 0,
              wind_speed_10m: 7.2,
              wind_direction_10m: 0,
            },
          })),
      })
      .mockRejectedValueOnce(new DOMException('Timed out', 'TimeoutError'))

    const result = await fetchBatchCardWeather(many)

    expect(result.size).toBe(50)
    expect(result.get('TEST_PARTIAL_0')).toEqual({
      temp: 21,
      icon: 'sunny',
      windSpeed: 7,
      windDirection: 'N',
    })
  })

  it('includes wind speed and direction in the card weather', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        {
          current: {
            temperature_2m: 18.6,
            weather_code: 3,
            wind_speed_10m: 12.4,
            wind_direction_10m: 92,
          },
        },
        {
          current: {
            temperature_2m: 19,
            weather_code: 3,
            wind_speed_10m: 5,
            wind_direction_10m: 200,
          },
        },
      ],
    })

    const result = await fetchBatchCardWeather([
      { code: 'TEST_WIND_A', coordinates: [36.1, -0.1] },
      { code: 'TEST_WIND_B', coordinates: [36.2, -0.2] },
    ])

    expect(result.get('TEST_WIND_A')).toEqual({
      temp: 19,
      icon: 'cloudy',
      windSpeed: 12,
      windDirection: 'E',
    })
    expect(result.get('TEST_WIND_B')?.windDirection).toBe('S')
  })
})

const currentReading = (temperature: number) => ({
  current: {
    temperature_2m: temperature,
    weather_code: 0,
    wind_speed_10m: 10,
    wind_direction_10m: 180,
  },
})

const latitudesRequested = (call: unknown[]) =>
  new URL(String(call[0])).searchParams.get('latitude')?.split(',') ?? []

describe('fetchBatchCardWeather cache per coordinate', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('fetches the coordinates shared by two overlapping requests once', async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [currentReading(20), currentReading(21)],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => currentReading(22),
      })

    await fetchBatchCardWeather([
      { code: 'TEST_OVERLAP_P', coordinates: [40.01, -1.5] },
      { code: 'TEST_OVERLAP_Q', coordinates: [40.02, -1.5] },
    ])
    const second = await fetchBatchCardWeather([
      { code: 'TEST_OVERLAP_Q', coordinates: [40.02, -1.5] },
      { code: 'TEST_OVERLAP_R', coordinates: [40.03, -1.5] },
    ])

    const calls = vi.mocked(global.fetch).mock.calls
    expect(calls).toHaveLength(2)
    expect(latitudesRequested(calls[1])).toEqual(['40.03'])
    expect(second.get('TEST_OVERLAP_Q')?.temp).toBe(21)
    expect(second.get('TEST_OVERLAP_R')?.temp).toBe(22)
  })

  it('shares cached coordinates between different beach codes', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => currentReading(19),
    })

    await fetchBatchCardWeather([
      { code: 'TEST_SHARED_A', coordinates: [40.11, -1.5] },
    ])
    const result = await fetchBatchCardWeather([
      { code: 'TEST_SHARED_B', coordinates: [40.111, -1.501] },
    ])

    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(result.get('TEST_SHARED_B')?.temp).toBe(19)
  })

  it('makes no upstream call when every coordinate is cached', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => [currentReading(23), currentReading(24)],
    })
    const cachedBeaches = [
      {
        code: 'TEST_ALL_HIT_A',
        coordinates: [40.21, -1.5] as [number, number],
      },
      {
        code: 'TEST_ALL_HIT_B',
        coordinates: [40.22, -1.5] as [number, number],
      },
    ]

    await fetchBatchCardWeather(cachedBeaches)
    const result = await fetchBatchCardWeather(cachedBeaches)

    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(result.get('TEST_ALL_HIT_B')?.temp).toBe(24)
  })

  it('fetches every coordinate of a cold listing in one batched call', async () => {
    const listing = Array.from({ length: 40 }, (_, i) => ({
      code: `TEST_COLD_${i}`,
      coordinates: [41 + i / 100, -1.5] as [number, number],
    }))
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => listing.map(() => currentReading(25)),
    })

    const result = await fetchBatchCardWeather(listing)

    const calls = vi.mocked(global.fetch).mock.calls
    expect(calls).toHaveLength(1)
    expect(latitudesRequested(calls[0])).toHaveLength(40)
    expect(result.size).toBe(40)
  })

  it('does not serve an entry cached for a longer lifetime', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => currentReading(26),
    })
    const beach = [
      { code: 'TEST_TTL', coordinates: [40.31, -1.5] as [number, number] },
    ]

    await fetchBatchCardWeather(beach)
    await fetchBatchCardWeather(beach, { ttlSeconds: 1800 })

    expect(global.fetch).toHaveBeenCalledTimes(2)
  })

  it('refetches a coordinate whose upstream chunk failed', async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({ ok: false })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => currentReading(27),
      })
    const beach = [
      { code: 'TEST_RETRY', coordinates: [40.41, -1.5] as [number, number] },
    ]

    const first = await fetchBatchCardWeather(beach)
    const second = await fetchBatchCardWeather(beach)

    expect(first.size).toBe(0)
    expect(second.get('TEST_RETRY')?.temp).toBe(27)
  })
})

describe('fetchBatchCardWeather reading time', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('keeps the upstream reading time', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        current: {
          time: '2026-07-14T11:15',
          temperature_2m: 25,
          weather_code: 0,
          wind_speed_10m: 12,
          wind_direction_10m: 90,
        },
      }),
    })

    const result = await fetchBatchCardWeather(
      [{ code: 'time', coordinates: [37.6, -0.9] }],
      { ttlSeconds: 1800 },
    )

    expect(result.get('time')?.observedAt).toBe('2026-07-14T11:15')
  })
})

describe('fetchMarineWeather', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('requests wave fields alongside the sea temperature', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false })

    await fetchMarineWeather(37.41, -1.51)

    const [requestUrl] = (global.fetch as ReturnType<typeof vi.fn>).mock
      .calls[0] as [string]
    const url = new URL(requestUrl)
    expect(url.searchParams.get('current')).toBe(
      'sea_surface_temperature,wave_height,wave_direction,wave_period,wind_wave_height,swell_wave_height',
    )
  })

  it('maps wave height, direction and period from the response', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        current: {
          sea_surface_temperature: 21.6,
          wave_height: 0.44,
          wave_direction: 95,
          wave_period: 4.6,
          wind_wave_height: 0.3,
          swell_wave_height: 0.21,
        },
      }),
    })

    const result = await fetchMarineWeather(37.42, -1.52)

    expect(result).toEqual({
      currentTemp: 22,
      waveHeight: 0.4,
      waveDirection: 'E',
      waveDirectionDegrees: 95,
      wavePeriod: 5,
      windWaveHeight: 0.3,
      swellWaveHeight: 0.2,
    })
  })

  it('omits wave fields when the model returns null for them', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        current: {
          sea_surface_temperature: 20.2,
          wave_height: null,
          wave_direction: null,
          wave_period: null,
        },
      }),
    })

    const result = await fetchMarineWeather(37.43, -1.53)

    expect(result).toEqual({ currentTemp: 20 })
  })
})

describe('parseOpenMeteoDate', () => {
  it('reads the Madrid calendar day as UTC midnight in any timezone', () => {
    const fecha = parseOpenMeteoDate('2026-10-27')
    expect(fecha).toBe(Date.UTC(2026, 9, 27))
    expect(new Date(fecha ?? 0).getUTCDay()).toBe(2)
  })

  it('matches the representation aemet.ts uses for the same day', () => {
    expect(parseOpenMeteoDate('2026-11-04')).toBe(Date.UTC(2026, 10, 4))
  })

  it('returns undefined for garbage and impossible dates', () => {
    expect(parseOpenMeteoDate('')).toBeUndefined()
    expect(parseOpenMeteoDate('not-a-date')).toBeUndefined()
    expect(parseOpenMeteoDate('2026-2-3')).toBeUndefined()
    expect(parseOpenMeteoDate('2026-02-30')).toBeUndefined()
    expect(parseOpenMeteoDate('2026-13-01')).toBeUndefined()
  })
})

describe('fetchOpenMeteoForecast', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('drops days whose date is malformed or impossible', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        daily: {
          time: ['2026-02-28', '2026-02-30', 'garbage'],
          weather_code: [0, 3, 1],
          temperature_2m_max: [18, 17, 16],
          temperature_2m_min: [9, 8, 7],
          wind_speed_10m_max: [10, 12, 11],
          wind_direction_10m_dominant: [90, 180, 270],
          uv_index_max: [3, 2, 2],
          precipitation_probability_max: [0, 30, 10],
        },
      }),
    })

    // Distinct coordinates: the edge cache is shared across tests
    const result = await fetchOpenMeteoForecast(38.11, -0.65)

    expect(result?.days.map((d) => d.fecha)).toEqual([Date.UTC(2026, 1, 28)])
  })

  it('keeps each daily date on its Madrid calendar day', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        daily: {
          time: ['2026-10-27', '2026-10-28'],
          weather_code: [0, 3],
          temperature_2m_max: [24.2, 22.8],
          temperature_2m_min: [15.1, 14.6],
          wind_speed_10m_max: [10.4, 12.9],
          wind_direction_10m_dominant: [90, 180],
          uv_index_max: [5.2, 4.1],
          precipitation_probability_max: [0, 30],
        },
      }),
    })

    const result = await fetchOpenMeteoForecast(37.44, -1.54)

    expect(result?.days.map((d) => d.fecha)).toEqual([
      Date.UTC(2026, 9, 27),
      Date.UTC(2026, 9, 28),
    ])
    expect(result?.days.map((d) => new Date(d.fecha).getUTCDay())).toEqual([
      2, 3,
    ])
  })
})
