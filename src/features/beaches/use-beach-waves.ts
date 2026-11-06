import { createServerFn } from '@tanstack/react-start'
import { useEffect, useState } from 'react'

import { parseBeachCodeInput } from './beach-code-input'

export const fetchMarineWeatherFn = createServerFn({ method: 'GET' })
  .validator(parseBeachCodeInput)
  .handler(async ({ data }) => {
    const [{ getBeachWeatherTargets }, { fetchMarineWeather }] =
      await Promise.all([
        import('@/lib/db-data/beach-queries'),
        import('@/lib/open-meteo'),
      ])
    const target = (await getBeachWeatherTargets([data.code])).at(0)
    if (!target) return null
    return fetchMarineWeather(...target.coordinates)
  })

/** Current wave height in metres, undefined until known or when missing. */
export function useBeachWaveHeight(
  beachCode: string,
  isEnabled: boolean,
): number | undefined {
  const [waveHeight, setWaveHeight] = useState<number>()

  useEffect(() => {
    if (!isEnabled) return
    let cancelled = false
    fetchMarineWeatherFn({ data: { code: beachCode } })
      .then((marine) => {
        if (!cancelled) setWaveHeight(marine?.waveHeight ?? undefined)
      })
      .catch(() => {
        // The hero stays without waves
      })
    return () => {
      cancelled = true
    }
  }, [beachCode, isEnabled])

  return waveHeight
}
