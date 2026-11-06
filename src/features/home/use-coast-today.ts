import { createServerFn } from '@tanstack/react-start'
import { useEffect, useState } from 'react'

import type { CoastToday } from '@/lib/coast-today'

// Open-Meteo refreshes current conditions every 15 minutes, and this strip is
// read right before leaving, so the two-hour card cache would be too old
const COAST_WEATHER_TTL_SECONDS = 30 * 60

const fetchCoastToday = createServerFn({ method: 'POST' }).handler(
  async (): Promise<CoastToday> => {
    const [
      { getBeachFlagTargets, getBeachWeatherTargets },
      { fetchBatchCardWeather },
      { getTodayBeachFlags },
      { buildCoastToday, coastReferenceCodes },
    ] = await Promise.all([
      import('@/lib/db-data/beach-queries'),
      import('@/lib/open-meteo'),
      import('@/lib/beach-status-112'),
      import('@/lib/coast-today'),
    ])
    const [beaches, weatherTargets] = await Promise.all([
      getBeachFlagTargets(),
      getBeachWeatherTargets(coastReferenceCodes()),
    ])
    const [weather, { flags, latestTime }] = await Promise.all([
      fetchBatchCardWeather(weatherTargets, {
        ttlSeconds: COAST_WEATHER_TTL_SECONDS,
      }),
      getTodayBeachFlags(beaches),
    ])
    return buildCoastToday({
      beaches,
      weather,
      flags,
      ...(latestTime && { flagsTime: latestTime }),
    })
  },
)

/**
 * Loads live coast facts after mount: the home HTML is cached at the edge for
 * an hour, so these cannot travel with the page.
 */
export function useCoastToday(): {
  today: CoastToday | undefined
  isLoading: boolean
} {
  const [today, setToday] = useState<CoastToday>()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetchCoastToday()
      .then((result) => {
        if (!cancelled) setToday(result)
      })
      .catch(() => {
        // Rows stay as plain links to each sea
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { today, isLoading }
}
