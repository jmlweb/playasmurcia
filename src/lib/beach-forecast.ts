import type {
  BeachForecast,
  ForecastDay,
  ForecastWaves,
} from '@/lib/forecast-days'
import type { MarineWeather } from '@/lib/open-meteo'

import {
  dropPastDays,
  fetchAemetForecast,
  getDayDescription,
} from '@/lib/aemet'
import { MAR_MENOR_SEA } from '@/lib/beach-facts'
import { mergeForecastDays } from '@/lib/forecast-days'
import { fetchMarineWeather, fetchOpenMeteoForecast } from '@/lib/open-meteo'
import { getWaveExposure } from '@/lib/wave-exposure'

const UPSTREAM_TIMEOUT_MS = 5000
const MISSING_TEMPERATURE = -999

export type ForecastTarget = {
  coordinates: [number, number]
  aemetId?: string
  sea: number
  shoreBearing?: number
}

/** The upstream clients have no timeout, and a hung one would stall the caller. */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs = UPSTREAM_TIMEOUT_MS,
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error('Upstream timeout'))
    }, timeoutMs)
  })
  return Promise.race([promise, timeout]).finally(() => {
    clearTimeout(timer)
  })
}

async function fetchAemetDays(aemetId: string): Promise<ForecastDay[]> {
  const apiKey = process.env.AEMET_API_KEY ?? ''
  if (!apiKey) return []
  const forecast = await fetchAemetForecast(aemetId, apiKey)
  if (!forecast) return []

  return dropPastDays(forecast.dias, new Date()).map((d) => ({
    fecha: d.fecha,
    skyDescription: getDayDescription(d.estadoCielo),
    skyIcon: '',
    tMaxima: d.tMaxima === MISSING_TEMPERATURE ? undefined : d.tMaxima,
    uvIndex: d.uvMax < 0 ? undefined : d.uvMax,
    wavesDescription: getDayDescription(d.oleaje) || undefined,
    waterTemp: d.tAgua,
  }))
}

const toWaves = (
  marine: MarineWeather | null,
  shoreBearing: number | undefined,
): ForecastWaves | undefined => {
  if (marine?.waveHeight == null) return undefined
  return {
    height: marine.waveHeight,
    direction: marine.waveDirection,
    exposure:
      shoreBearing != null && marine.waveDirectionDegrees != null
        ? getWaveExposure(shoreBearing, marine.waveDirectionDegrees)
        : undefined,
  }
}

const withoutWaves = ({
  wavesDescription: _wavesDescription,
  ...day
}: ForecastDay): ForecastDay => day

/**
 * The one forecast of a beach: the page, its markdown and the agent tools all
 * read this, so they cannot disagree. Returns null when no source answers.
 */
export async function fetchBeachForecast(
  target: ForecastTarget,
): Promise<BeachForecast | null> {
  const [latitude, longitude] = target.coordinates
  const [openMeteo, marine, aemetDays] = await Promise.all([
    withTimeout(fetchOpenMeteoForecast(latitude, longitude)).catch(() => null),
    withTimeout(fetchMarineWeather(latitude, longitude)).catch(() => null),
    target.aemetId
      ? withTimeout(fetchAemetDays(target.aemetId)).catch(() => [])
      : Promise.resolve([]),
  ])

  const hasAemet = aemetDays.length > 0
  if (!hasAemet && !openMeteo) return null

  // The cached forecast outlives midnight: without this, yesterday leads the
  // list and the widget labels it as today
  const openMeteoDays = dropPastDays(openMeteo?.days ?? [], new Date())
  const days = hasAemet
    ? mergeForecastDays(aemetDays, openMeteoDays)
    : openMeteoDays
  const isLagoon = target.sea === MAR_MENOR_SEA

  return {
    source: !hasAemet ? 'open-meteo' : openMeteo ? 'aemet+open-meteo' : 'aemet',
    // Open-sea wave data does not describe the lagoon
    days: isLagoon ? days.map(withoutWaves) : days,
    current: openMeteo?.current,
    observedAt: openMeteo?.observedAt,
    // The marine model has no lagoon cell and answers with the nearest open-sea
    // one, so the Mar Menor only gets the temperature AEMET forecasts for it
    waterTemp: isLagoon
      ? aemetDays.at(0)?.waterTemp
      : (marine?.currentTemp ?? aemetDays.at(0)?.waterTemp),
    waves: isLagoon ? undefined : toWaves(marine, target.shoreBearing),
  }
}
