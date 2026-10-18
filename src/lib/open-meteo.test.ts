import { afterEach, describe, expect, it, vi } from 'vitest'

import { fetchBatchCardWeather, fetchMarineWeather } from './open-meteo'

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
      coordinates: [38 + i / 100, -0.5] as [number, number],
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
