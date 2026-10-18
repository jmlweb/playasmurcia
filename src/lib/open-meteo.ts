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
  current?: OpenMeteoCurrent
}

export type MarineWeather = {
  currentTemp: number
  // Optional: entries cached before waves were added lack them
  waveHeight?: number
  waveDirection?: string
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
}

// ---------------------------------------------------------------------------
// API types
// ---------------------------------------------------------------------------

type OpenMeteoResponse = {
  current?: {
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
    temperature_2m: number
    weather_code: number
    wind_speed_10m: number
    wind_direction_10m: number
  }
}

// ---------------------------------------------------------------------------
// Fetch
// ---------------------------------------------------------------------------

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
      days: daily.time.map((dateStr, i) => ({
        fecha: new Date(dateStr).getTime(),
        skyDescription: wmoToDescription(daily.weather_code[i]),
        skyIcon: wmoToIcon(daily.weather_code[i]),
        tMaxima: Math.round(daily.temperature_2m_max[i]),
        tMinima: Math.round(daily.temperature_2m_min[i]),
        windSpeed: Math.round(daily.wind_speed_10m_max[i]),
        windDirection: degreesToDirection(daily.wind_direction_10m_dominant[i]),
        uvIndex: Math.round(daily.uv_index_max[i]),
        precipitationProbability: daily.precipitation_probability_max[i] ?? 0,
      })),
    }

    if (data.current) {
      const c = data.current
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

const CARD_CACHE_NS = 'open-meteo-card-v2'
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

/**
 * Fetches current weather for multiple beaches in chunked API calls.
 * Returns a Map keyed by beach code with compact weather data (temp + icon).
 *
 * Deduplicates by rounded coordinates — nearby beaches share one data point.
 */
export async function fetchBatchCardWeather(
  beaches: { code: string; coordinates: [number, number] }[],
): Promise<Map<string, CardWeather>> {
  const result = new Map<string, CardWeather>()
  if (beaches.length === 0) return result

  // Build a stable cache key from sorted beach codes
  const cacheKey = beaches
    .map((b) => b.code)
    .sort()
    .join(',')

  const cached = await edgeCacheGet<[string, CardWeather][]>(
    CARD_CACHE_NS,
    cacheKey,
  )
  if (cached) {
    return new Map(cached)
  }

  // Deduplicate by rounded coordinates
  const coordMap = new Map<string, string[]>() // "lat,lng" -> [beachCode, ...]
  const uniqueCoords: { lat: number; lng: number }[] = []

  for (const beach of beaches) {
    const lat = Math.round(beach.coordinates[0] * 100) / 100
    const lng = Math.round(beach.coordinates[1] * 100) / 100
    const key = `${lat},${lng}`
    const existing = coordMap.get(key)
    if (existing) {
      existing.push(beach.code)
    } else {
      coordMap.set(key, [beach.code])
      uniqueCoords.push({ lat, lng })
    }
  }

  // One GET URL per chunk keeps the query string well below URL-length limits
  const chunks: { lat: number; lng: number }[][] = []
  for (let i = 0; i < uniqueCoords.length; i += CARD_CHUNK_SIZE) {
    chunks.push(uniqueCoords.slice(i, i + CARD_CHUNK_SIZE))
  }

  const outcomes = await Promise.all(
    chunks.map((chunk) => fetchCardWeatherChunk(chunk)),
  )

  let isComplete = true
  outcomes.forEach((responses, chunkIndex) => {
    if (!responses) {
      isComplete = false
      return
    }
    chunks[chunkIndex].forEach((coord, i) => {
      const resp = responses[i]
      if (!resp?.current) return

      const weather: CardWeather = {
        temp: Math.round(resp.current.temperature_2m),
        icon: wmoToIcon(resp.current.weather_code),
        windSpeed: Math.round(resp.current.wind_speed_10m),
        windDirection: degreesToDirection(resp.current.wind_direction_10m),
      }
      for (const code of coordMap.get(`${coord.lat},${coord.lng}`) ?? []) {
        result.set(code, weather)
      }
    })
  })

  // A partial result would be served for the whole TTL, so cache only complete ones
  if (isComplete) {
    await edgeCacheSet(
      CARD_CACHE_NS,
      cacheKey,
      Array.from(result.entries()),
      CARD_CACHE_TTL,
    )
  }

  return result
}

// ---------------------------------------------------------------------------
// Marine weather (sea water temperature and waves)
// ---------------------------------------------------------------------------

const MARINE_BASE_URL = 'https://marine-api.open-meteo.com/v1/marine'
const MARINE_CACHE_NS = 'open-meteo-marine'

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
  const waveDirection =
    current.wave_direction != null && Number.isFinite(current.wave_direction)
      ? degreesToDirection(current.wave_direction)
      : undefined

  return {
    currentTemp: Math.round(current.sea_surface_temperature),
    ...(waveHeight !== undefined && { waveHeight }),
    ...(waveDirection !== undefined && { waveDirection }),
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
