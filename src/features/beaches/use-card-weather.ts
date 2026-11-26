import { createServerFn } from '@tanstack/react-start'
import { useEffect, useState } from 'react'

import type { CardWeather } from '@/lib/open-meteo'

import { parseBeachCodesInput } from './beach-code-input'

const fetchCardWeather = createServerFn({ method: 'POST' })
  .validator(parseBeachCodesInput)
  .handler(async ({ data }) => {
    const [{ getBeachWeatherTargets }, { fetchBatchCardWeather }] =
      await Promise.all([
        import('@/lib/db-data/beach-queries'),
        import('@/lib/open-meteo'),
      ])
    // Coordinates must come from the DB: caller-supplied ones would fill the
    // shared per-coordinate cache and spend the Open-Meteo quota on any point
    const weatherMap = await fetchBatchCardWeather(
      await getBeachWeatherTargets(data.codes),
    )
    return Object.fromEntries(weatherMap)
  })

/**
 * Loads card weather after mount so a slow Open-Meteo response never
 * delays the page itself. Cards render without weather until it arrives.
 */
export function useCardWeather(
  beaches: readonly { code: string }[],
): Record<string, CardWeather> {
  const [weather, setWeather] = useState<Record<string, CardWeather>>({})

  useEffect(() => {
    if (beaches.length === 0) return
    let cancelled = false
    fetchCardWeather({ data: { codes: beaches.map(({ code }) => code) } })
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
