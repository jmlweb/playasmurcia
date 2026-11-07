import type { WaveExposure } from '@/lib/wave-exposure'

export const ForecastSourceLabel = {
  aemet: 'AEMET',
  'open-meteo': 'Open-Meteo',
  'aemet+open-meteo': 'AEMET y Open-Meteo',
} as const

export type ForecastSource = keyof typeof ForecastSourceLabel

export type ForecastDay = {
  fecha: number
  skyDescription: string
  /** Empty when only AEMET answered: its sky is text, not an icon code */
  skyIcon: string
  tMaxima?: number
  tMinima?: number
  windSpeed?: number
  windDirection?: string
  uvIndex?: number
  precipitationProbability?: number
  /** AEMET only: "Débil", "Moderado", "Fuerte" */
  wavesDescription?: string
  /** AEMET only */
  waterTemp?: number
}

export type ForecastWaves = {
  height?: number
  direction?: string
  exposure?: WaveExposure
}

export type BeachForecast = {
  source: ForecastSource
  days: ForecastDay[]
  current?: {
    temp: number
    apparentTemp: number
    skyDescription: string
    skyIcon: string
    windSpeed: number
    windDirection: string
    uvIndex: number
  }
  /** Madrid local time of the observation, "2026-11-07T01:45" */
  observedAt?: string
  waterTemp?: number
  waves?: ForecastWaves
}

/**
 * Extends a shorter forecast with the days the longer one has beyond its end.
 * Days both sources cover stay with the primary forecast.
 */
export function appendLaterDays<T extends { fecha: number }>(
  primary: readonly T[],
  fallback: readonly T[],
): T[] {
  const lastPrimaryDay = Math.max(...primary.map((d) => d.fecha))
  return [...primary, ...fallback.filter((d) => d.fecha > lastPrimaryDay)]
}

/**
 * AEMET wins what it publishes (sky, maximum, sea), and Open-Meteo fills what it
 * lacks (minimum, rain, wind), so no day loses data and every surface agrees.
 */
export function mergeForecastDays(
  aemetDays: readonly ForecastDay[],
  openMeteoDays: readonly ForecastDay[],
): ForecastDay[] {
  const openMeteoByDay = new Map(openMeteoDays.map((d) => [d.fecha, d]))
  const merged = aemetDays.map((aemet) => {
    const openMeteo = openMeteoByDay.get(aemet.fecha)
    if (!openMeteo) return aemet
    return {
      ...openMeteo,
      skyDescription: aemet.skyDescription || openMeteo.skyDescription,
      skyIcon: aemet.skyDescription ? aemet.skyIcon : openMeteo.skyIcon,
      tMaxima: aemet.tMaxima ?? openMeteo.tMaxima,
      uvIndex: aemet.uvIndex ?? openMeteo.uvIndex,
      wavesDescription: aemet.wavesDescription,
      waterTemp: aemet.waterTemp,
    }
  })
  return appendLaterDays(merged, openMeteoDays)
}
