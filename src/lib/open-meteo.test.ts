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
})
