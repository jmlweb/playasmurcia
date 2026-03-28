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

export interface OpenMeteoForecastDay {
  fecha: number
  skyDescription: string
  skyIcon: string
  tMaxima: number
  tMinima: number
  windSpeed: number
  windDirection: string
  uvIndex: number
}

export interface OpenMeteoForecast {
  days: Array<OpenMeteoForecastDay>
}

export interface CardWeather {
  temp: number
  icon: string
}

// ---------------------------------------------------------------------------
// API types
// ---------------------------------------------------------------------------

interface OpenMeteoResponse {
  daily: {
    time: Array<string>
    weather_code: Array<number>
    temperature_2m_max: Array<number>
    temperature_2m_min: Array<number>
    wind_speed_10m_max: Array<number>
    wind_direction_10m_dominant: Array<number>
    uv_index_max: Array<number>
  }
}

interface CurrentWeatherResponse {
  latitude: Array<number>
  longitude: Array<number>
  current: Array<{
    temperature_2m: number
    weather_code: number
  }>
}

// For the batch current weather endpoint
interface MultiCurrentResponse {
  latitude: number
  longitude: number
  current: {
    temperature_2m: number
    weather_code: number
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

  const cached = await edgeCacheGet<OpenMeteoForecast | null>(CACHE_NS, cacheKey)
  if (cached !== undefined) return cached

  try {
    const params = new URLSearchParams({
      latitude: String(lat),
      longitude: String(lng),
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max,wind_direction_10m_dominant,uv_index_max',
      timezone: 'Europe/Madrid',
      forecast_days: '3',
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
      })),
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

const CARD_CACHE_NS = 'open-meteo-card'
const CARD_CACHE_TTL = 2 * 60 * 60 // 2 hours

/**
 * Fetches current weather for multiple beaches in a single API call.
 * Returns a Map keyed by beach code with compact weather data (temp + icon).
 *
 * Deduplicates by rounded coordinates — nearby beaches share one data point.
 */
export async function fetchBatchCardWeather(
  beaches: Array<{ code: string; coordinates: [number, number] }>,
): Promise<Map<string, CardWeather>> {
  const result = new Map<string, CardWeather>()
  if (beaches.length === 0) return result

  // Check cache first
  const cached = await edgeCacheGet<Array<[string, CardWeather]>>(CARD_CACHE_NS, 'batch')
  if (cached) {
    return new Map(cached)
  }

  // Deduplicate by rounded coordinates
  const coordMap = new Map<string, Array<string>>() // "lat,lng" -> [beachCode, ...]
  const uniqueCoords: Array<{ lat: number; lng: number }> = []

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

  try {
    // Open-Meteo supports comma-separated coordinates for multi-location
    const latitudes = uniqueCoords.map((c) => c.lat).join(',')
    const longitudes = uniqueCoords.map((c) => c.lng).join(',')

    const params = new URLSearchParams({
      latitude: latitudes,
      longitude: longitudes,
      current: 'temperature_2m,weather_code',
      timezone: 'Europe/Madrid',
      forecast_days: '1',
    })

    const res = await fetch(`${BASE_URL}?${params}`)
    if (!res.ok) return result

    // When multiple locations: response is an array
    // When single location: response is a single object
    const rawData = await res.json()
    const responses: Array<MultiCurrentResponse> = Array.isArray(rawData) ? rawData : [rawData]

    for (let i = 0; i < uniqueCoords.length; i++) {
      const resp = responses[i]
      if (!resp?.current) continue

      const weather: CardWeather = {
        temp: Math.round(resp.current.temperature_2m),
        icon: wmoToIcon(resp.current.weather_code),
      }

      const key = `${uniqueCoords[i].lat},${uniqueCoords[i].lng}`
      const beachCodes = coordMap.get(key) ?? []
      for (const code of beachCodes) {
        result.set(code, weather)
      }
    }

    // Cache the batch result
    await edgeCacheSet(CARD_CACHE_NS, 'batch', Array.from(result.entries()), CARD_CACHE_TTL)
  } catch {
    // Silent failure — cards just won't show weather
  }

  return result
}
