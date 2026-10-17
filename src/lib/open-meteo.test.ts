import { afterEach, describe, expect, it, vi } from 'vitest'

import { fetchBatchCardWeather } from './open-meteo'

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
