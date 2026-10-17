import { createServerFn } from '@tanstack/react-start'
import { useEffect, useState } from 'react'

import type { CardWeather } from '@/lib/open-meteo'

import type { CardWeatherBeach } from './card-weather-input'

import { parseCardWeatherInput } from './card-weather-input'

const fetchCardWeather = createServerFn({ method: 'POST' })
  .validator(parseCardWeatherInput)
  .handler(async ({ data }) => {
    const { fetchBatchCardWeather } = await import('@/lib/open-meteo')
    const weatherMap = await fetchBatchCardWeather(data.beaches)
    return Object.fromEntries(weatherMap)
  })

/**
 * Loads card weather after mount so a slow Open-Meteo response never
 * delays the page itself. Cards render without weather until it arrives.
 */
export function useCardWeather(
  beaches: readonly CardWeatherBeach[],
): Record<string, CardWeather> {
  const [weather, setWeather] = useState<Record<string, CardWeather>>({})

  useEffect(() => {
    if (beaches.length === 0) return
    let cancelled = false
    // Send only what the server needs, not whole beach records
    const payload = beaches.map(({ code, coordinates }) => ({
      code,
      coordinates,
    }))
    fetchCardWeather({ data: { beaches: payload } })
      .then((result) => {
        if (!cancelled) setWeather(result)
      })
      .catch(() => {
        // Cards stay without weather
      })
    return () => {
      cancelled = true
    }
  }, [beaches])

  return weather
}
