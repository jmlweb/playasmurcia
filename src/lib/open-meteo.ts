import { edgeCacheGet, edgeCacheSet } from './edge-cache'

const BASE_URL = 'https://api.open-meteo.com/v1/forecast'
const CACHE_TTL_SECONDS = 60 * 60 // 1 hour
const CACHE_NS = 'open-meteo'

// ---------------------------------------------------------------------------
// WMO Weather Code mapping
// ---------------------------------------------------------------------------

const WmoDescriptions: Record<number, { description: string; icon: string }> = {
  0: { description: 'Despejado', icon: 'sunny' },
  1: { description: 'Poco nuboso', icon: 'partly-cloudy' },
  2: { description: 'Intervalos nubosos', icon: 'partly-cloudy' },
  3: { description: 'Cubierto', icon: 'cloudy' },
  45: { description: 'Niebla', icon: 'fog' },
  48: { description: 'Niebla con escarcha', icon: 'fog' },
  51: { description: 'Llovizna débil', icon: 'rain' },
  53: { description: 'Llovizna moderada', icon: 'rain' },
  55: { description: 'Llovizna intensa', icon: 'rain' },
  61: { description: 'Lluvia débil', icon: 'rain' },
  63: { description: 'Lluvia moderada', icon: 'rain' },
  65: { description: 'Lluvia fuerte', icon: 'rain' },
  71: { description: 'Nevada débil', icon: 'cloudy' },
  73: { description: 'Nevada moderada', icon: 'cloudy' },
  75: { description: 'Nevada fuerte', icon: 'cloudy' },
  80: { description: 'Chubascos débiles', icon: 'rain' },
  81: { description: 'Chubascos moderados', icon: 'rain' },
  82: { description: 'Chubascos fuertes', icon: 'rain' },
  95: { description: 'Tormenta', icon: 'storm' },
  96: { description: 'Tormenta con granizo', icon: 'storm' },
  99: { description: 'Tormenta fuerte con granizo', icon: 'storm' },
}

function wmoToDescription(code: number): string {
  return WmoDescriptions[code]?.description ?? 'Desconocido'
}

function wmoToIcon(code: number): string {
  return WmoDescriptions[code]?.icon ?? 'unknown'
}

// ---------------------------------------------------------------------------
// Wind direction from degrees
// ---------------------------------------------------------------------------

function degreesToDirection(deg: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO']
  const index = Math.round(deg / 45) % 8
  return directions[index]
}

// ---------------------------------------------------------------------------
// Public types (unified with WeatherWidget expectations)
// ---------------------------------------------------------------------------

export type OpenMeteoForecastDay = {
  fecha: number
  skyDescription: string
  skyIcon: string
  tMaxima: number
  tMinima: number
  windSpeed: number
  windDirection: string
  uvIndex: number
  precipitationProbability: number
}

export type OpenMeteoCurrent = {
  temp: number
  apparentTemp: number
  skyDescription: string
  skyIcon: string
  windSpeed: number
  windDirection: string
  uvIndex: number
}

export type OpenMeteoForecast = {
  days: OpenMeteoForecastDay[]
  /** Madrid local time of `current`; entries cached earlier lack it */
  observedAt?: string
  current?: OpenMeteoCurrent
}

export type MarineWeather = {
  currentTemp: number
  // Optional: entries cached before waves were added lack them
  waveHeight?: number
  waveDirection?: string
  waveDirectionDegrees?: number
  wavePeriod?: number
  windWaveHeight?: number
  swellWaveHeight?: number
}

export type CardWeather = {
  temp: number
  icon: string
  // Optional: entries cached before wind was added lack them
  windSpeed?: number
  windDirection?: string
  // Local time of the upstream reading, e.g. 2026-07-14T11:15
  observedAt?: string
}

// ---------------------------------------------------------------------------
// API types
// ---------------------------------------------------------------------------

type OpenMeteoResponse = {
  current?: {
    time?: string
    temperature_2m: number
    apparent_temperature: number
    weather_code: number
    wind_speed_10m: number
    wind_direction_10m: number
    uv_index: number
  }
  daily: {
    time: string[]
    weather_code: number[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    wind_speed_10m_max: number[]
    wind_direction_10m_dominant: number[]
    uv_index_max: number[]
    precipitation_probability_max: number[]
  }
}

// For the batch current weather endpoint
type MultiCurrentResponse = {
  latitude: number
  longitude: number
  current: {
    time: string
    temperature_2m: number
    weather_code: number
    wind_speed_10m: number
    wind_direction_10m: number
  }
}

// ---------------------------------------------------------------------------
// Fetch
// ---------------------------------------------------------------------------

// Open-Meteo sends "2026-10-27" as a Europe/Madrid calendar day. UTC midnight of
// that day is the representation aemet.ts and the widget share: it keeps the
// weekday stable for visitors in any timezone when read with the UTC getters.
// Returns undefined for anything that is not a real YYYY-MM-DD calendar day:
// a NaN or rolled-over date would miss the forecast-days lookup and render an
// undefined weekday in the widget.
export function parseOpenMeteoDate(dateStr: string): number | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(dateStr)
  if (!match) return undefined
  const [year, month, day] = match.slice(1).map(Number)
  const fecha = Date.UTC(year, month - 1, day)
  const date = new Date(fecha)
  const isSameDay =
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  return isSameDay ? fecha : undefined
}

export async function fetchOpenMeteoForecast(
  latitude: number,
  longitude: number,
): Promise<OpenMeteoForecast | null> {
  // Round coordinates to 2 decimals for cache key (nearby beaches share cache)
  const lat = Math.round(latitude * 100) / 100
  const lng = Math.round(longitude * 100) / 100
  const cacheKey = `${lat},${lng}`

  const cached = await edgeCacheGet<OpenMeteoForecast | null>(
    CACHE_NS,
    cacheKey,
  )
  if (cached !== undefined) return cached

  try {
    const params = new URLSearchParams({
      latitude: String(lat),
      longitude: String(lng),
      current:
        'temperature_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,uv_index',
      daily:
        'weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max,wind_direction_10m_dominant,uv_index_max,precipitation_probability_max',
      timezone: 'Europe/Madrid',
      forecast_days: '7',
    })

    const res = await fetch(`${BASE_URL}?${params}`)
    if (!res.ok) {
      await edgeCacheSet(CACHE_NS, cacheKey, null, CACHE_TTL_SECONDS)
      return null
    }

    const data = (await res.json()) as OpenMeteoResponse
    const { daily } = data

    if (!daily?.time?.length) {
      await edgeCacheSet(CACHE_NS, cacheKey, null, CACHE_TTL_SECONDS)
      return null
    }

    const forecast: OpenMeteoForecast = {
      days: daily.time.flatMap((dateStr, i) => {
        const fecha = parseOpenMeteoDate(dateStr)
        if (fecha === undefined) return []
        return [
          {
            fecha,
            skyDescription: wmoToDescription(daily.weather_code[i]),
            skyIcon: wmoToIcon(daily.weather_code[i]),
            tMaxima: Math.round(daily.temperature_2m_max[i]),
            tMinima: Math.round(daily.temperature_2m_min[i]),
            windSpeed: Math.round(daily.wind_speed_10m_max[i]),
            windDirection: degreesToDirection(
              daily.wind_direction_10m_dominant[i],
            ),
            uvIndex: Math.round(daily.uv_index_max[i]),
            precipitationProbability:
              daily.precipitation_probability_max[i] ?? 0,
          },
        ]
      }),
    }

    // Every date unusable: cache the miss like an empty daily block
    if (forecast.days.length === 0) {
      await edgeCacheSet(CACHE_NS, cacheKey, null, CACHE_TTL_SECONDS)
      return null
    }

    if (data.current) {
      const c = data.current
      forecast.observedAt = c.time
      forecast.current = {
        temp: Math.round(c.temperature_2m),
        apparentTemp: Math.round(c.apparent_temperature),
        skyDescription: wmoToDescription(c.weather_code),
        skyIcon: wmoToIcon(c.weather_code),
        windSpeed: Math.round(c.wind_speed_10m),
        windDirection: degreesToDirection(c.wind_direction_10m),
        uvIndex: Math.round(c.uv_index),
      }
    }

    await edgeCacheSet(CACHE_NS, cacheKey, forecast, CACHE_TTL_SECONDS)
    return forecast
  } catch {
    await edgeCacheSet(CACHE_NS, cacheKey, null, CACHE_TTL_SECONDS)
    return null
  }
}

// ---------------------------------------------------------------------------
// Batch current weather for cards
// ---------------------------------------------------------------------------

// v4: one entry per rounded coordinate instead of one per set of beach codes
const CARD_CACHE_NS = 'open-meteo-card-v4'
const CARD_CACHE_TTL = 2 * 60 * 60 // 2 hours
// Cards are decorative: a slow upstream must not hold the whole page response
const CARD_FETCH_TIMEOUT_MS = 2000
const CARD_CHUNK_SIZE = 50

async function fetchCardWeatherChunk(
  coords: { lat: number; lng: number }[],
): Promise<MultiCurrentResponse[] | null> {
  try {
    const params = new URLSearchParams({
      latitude: coords.map((c) => c.lat).join(','),
      longitude: coords.map((c) => c.lng).join(','),
      current: 'temperature_2m,weather_code,wind_speed_10m,wind_direction_10m',
      timezone: 'Europe/Madrid',
      forecast_days: '1',
    })

    const res = await fetch(`${BASE_URL}?${params}`, {
      signal: AbortSignal.timeout(CARD_FETCH_TIMEOUT_MS),
    })
    if (!res.ok) return null

    // Multiple locations return an array, a single location returns an object
    const rawData = await res.json()
    return Array.isArray(rawData) ? rawData : [rawData]
  } catch {
    // Silent failure — cards just won't show weather
    return null
  }
}

type RoundedCoordinate = { lat: number; lng: number }

function toCardWeather(current: MultiCurrentResponse['current']): CardWeather {
  return {
    temp: Math.round(current.temperature_2m),
    icon: wmoToIcon(current.weather_code),
    windSpeed: Math.round(current.wind_speed_10m),
    windDirection: degreesToDirection(current.wind_direction_10m),
    observedAt: current.time,
  }
}

// Upstream fetches only the coordinates missing from the cache, so the number
// of calls is bounded by the real coordinates, not by the code sets callers send
async function fetchMissingCardWeather(
  missing: RoundedCoordinate[],
): Promise<Map<string, CardWeather>> {
  const fetched = new Map<string, CardWeather>()

  // One GET URL per chunk keeps the query string well below URL-length limits
  const chunks: RoundedCoordinate[][] = []
  for (let i = 0; i < missing.length; i += CARD_CHUNK_SIZE) {
    chunks.push(missing.slice(i, i + CARD_CHUNK_SIZE))
  }

  const outcomes = await Promise.all(
    chunks.map((chunk) => fetchCardWeatherChunk(chunk)),
  )

  outcomes.forEach((responses, chunkIndex) => {
    chunks[chunkIndex].forEach((coord, i) => {
      const current = responses?.[i]?.current
      if (current) {
        fetched.set(`${coord.lat},${coord.lng}`, toCardWeather(current))
      }
    })
  })

  return fetched
}

/**
 * Fetches current weather for multiple beaches in chunked API calls.
 * Returns a Map keyed by beach code with compact weather data (temp + icon).
 *
 * Caches each rounded coordinate on its own — nearby beaches share one data
 * point, and overlapping code sets reuse what earlier requests fetched.
 */
export async function fetchBatchCardWeather(
  beaches: { code: string; coordinates: [number, number] }[],
  { ttlSeconds = CARD_CACHE_TTL }: { ttlSeconds?: number } = {},
): Promise<Map<string, CardWeather>> {
  const result = new Map<string, CardWeather>()
  if (beaches.length === 0) return result

  const codesByCoordinate = new Map<string, string[]>()
  const uniqueCoords: RoundedCoordinate[] = []

  for (const beach of beaches) {
    const lat = Math.round(beach.coordinates[0] * 100) / 100
    const lng = Math.round(beach.coordinates[1] * 100) / 100
    const key = `${lat},${lng}`
    const existing = codesByCoordinate.get(key)
    if (existing) {
      existing.push(beach.code)
    } else {
      codesByCoordinate.set(key, [beach.code])
      uniqueCoords.push({ lat, lng })
    }
  }

  // The TTL is part of the key so a fresher caller is never served an entry
  // stored for a longer one
  const cacheKeyFor = (coordinateKey: string) =>
    `${String(ttlSeconds)}:${coordinateKey}`

  const cachedEntries = await Promise.all(
    uniqueCoords.map(({ lat, lng }) =>
      edgeCacheGet<CardWeather>(CARD_CACHE_NS, cacheKeyFor(`${lat},${lng}`)),
    ),
  )

  const weatherByCoordinate = new Map<string, CardWeather>()
  const missing: RoundedCoordinate[] = []
  uniqueCoords.forEach((coord, i) => {
    const cached = cachedEntries[i]
    if (cached) {
      weatherByCoordinate.set(`${coord.lat},${coord.lng}`, cached)
    } else {
      missing.push(coord)
    }
  })

  if (missing.length > 0) {
    const fetched = await fetchMissingCardWeather(missing)
    // Failed coordinates are not cached, so the next request retries them
    await Promise.all(
      Array.from(fetched, ([coordinateKey, weather]) => {
        weatherByCoordinate.set(coordinateKey, weather)
        return edgeCacheSet(
          CARD_CACHE_NS,
          cacheKeyFor(coordinateKey),
          weather,
          ttlSeconds,
        )
      }),
    )
  }

  for (const [coordinateKey, weather] of weatherByCoordinate) {
    for (const code of codesByCoordinate.get(coordinateKey) ?? []) {
      result.set(code, weather)
    }
  }

  return result
}

// ---------------------------------------------------------------------------
// Marine weather (sea water temperature and waves)
// ---------------------------------------------------------------------------

const MARINE_BASE_URL = 'https://marine-api.open-meteo.com/v1/marine'
const MARINE_CACHE_NS = 'open-meteo-marine-v2'

type MarineResponse = {
  current?: {
    sea_surface_temperature: number
    wave_height?: number | null
    wave_direction?: number | null
    wave_period?: number | null
    wind_wave_height?: number | null
    swell_wave_height?: number | null
  }
}

function roundMetres(value: number | null | undefined): number | undefined {
  if (value == null || !Number.isFinite(value)) return undefined
  return Math.round(value * 10) / 10
}

function mapMarineCurrent(
  current: NonNullable<MarineResponse['current']>,
): MarineWeather {
  const waveHeight = roundMetres(current.wave_height)
  const windWaveHeight = roundMetres(current.wind_wave_height)
  const swellWaveHeight = roundMetres(current.swell_wave_height)
  const wavePeriod =
    current.wave_period != null && Number.isFinite(current.wave_period)
      ? Math.round(current.wave_period)
      : undefined
  const rawWaveDirection = current.wave_direction
  const waveDirectionDegrees =
    rawWaveDirection != null && Number.isFinite(rawWaveDirection)
      ? Math.round(rawWaveDirection)
      : undefined
  const waveDirection =
    waveDirectionDegrees !== undefined
      ? degreesToDirection(waveDirectionDegrees)
      : undefined

  return {
    currentTemp: Math.round(current.sea_surface_temperature),
    ...(waveHeight !== undefined && { waveHeight }),
    ...(waveDirection !== undefined && { waveDirection }),
    ...(waveDirectionDegrees !== undefined && { waveDirectionDegrees }),
    ...(wavePeriod !== undefined && { wavePeriod }),
    ...(windWaveHeight !== undefined && { windWaveHeight }),
    ...(swellWaveHeight !== undefined && { swellWaveHeight }),
  }
}

export async function fetchMarineWeather(
  latitude: number,
  longitude: number,
): Promise<MarineWeather | null> {
  const lat = Math.round(latitude * 100) / 100
  const lng = Math.round(longitude * 100) / 100
  const cacheKey = `${lat},${lng}`

  const cached = await edgeCacheGet<MarineWeather | null>(
    MARINE_CACHE_NS,
    cacheKey,
  )
  if (cached !== undefined) return cached

  try {
    const params = new URLSearchParams({
      latitude: String(lat),
      longitude: String(lng),
      current:
        'sea_surface_temperature,wave_height,wave_direction,wave_period,wind_wave_height,swell_wave_height',
      timezone: 'Europe/Madrid',
      forecast_days: '1',
    })

    const res = await fetch(`${MARINE_BASE_URL}?${params}`)
    if (!res.ok) {
      await edgeCacheSet(MARINE_CACHE_NS, cacheKey, null, CACHE_TTL_SECONDS)
      return null
    }

    const data = (await res.json()) as MarineResponse
    if (!data.current) {
      await edgeCacheSet(MARINE_CACHE_NS, cacheKey, null, CACHE_TTL_SECONDS)
      return null
    }

    const result = mapMarineCurrent(data.current)

    await edgeCacheSet(MARINE_CACHE_NS, cacheKey, result, CACHE_TTL_SECONDS)
    return result
  } catch {
    await edgeCacheSet(MARINE_CACHE_NS, cacheKey, null, CACHE_TTL_SECONDS)
    return null
  }
}
