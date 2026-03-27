const AEMET_BASE_URL = 'https://opendata.aemet.es/opendata/api'
const CACHE_TTL_MS = 30 * 60 * 1000 // 30 minutes

interface CacheEntry<T> {
  data: T
  expiresAt: number
}

const cache = new Map<string, CacheEntry<AemetBeachForecast | null>>()

export interface AemetSkyPeriod {
  periodo: '00-24' | '00-12' | '12-24' | string
  descripcion: string
  value: string
}

export interface AemetWindPeriod {
  periodo: string
  velocidad: number
  direccion: string
}

export interface AemetWavePeriod {
  periodo: string
  descripcion: string
  value: string
}

export interface AemetForecastDay {
  fecha: number
  estadoCielo: Array<AemetSkyPeriod>
  viento: Array<AemetWindPeriod>
  oleaje: Array<AemetWavePeriod>
  tMaxima: number
  tMinima: number
  indiceUV: number
  sTermica: { tMaxima?: number; tMinima?: number }
}

export interface AemetBeachForecast {
  elaborado: string
  dias: Array<AemetForecastDay>
}

interface AemetMetaResponse {
  estado: number
  datos: string
  descripcion?: string
}

interface AemetRawDay {
  fecha: number
  estadoCielo?: Array<AemetSkyPeriod>
  viento?: Array<AemetWindPeriod>
  oleaje?: Array<AemetWavePeriod>
  tMaxima?: number
  tMinima?: number
  indiceUV?: number
  sTermica?: { tMaxima?: number; tMinima?: number }
}

interface AemetRawPrediction {
  elaborado: string
  prediccion: {
    dia: Array<AemetRawDay>
  }
}

function getCached(aemetId: string): AemetBeachForecast | null | undefined {
  const entry = cache.get(aemetId)
  if (!entry) return undefined
  if (Date.now() > entry.expiresAt) {
    cache.delete(aemetId)
    return undefined
  }
  return entry.data
}

function setCached(aemetId: string, data: AemetBeachForecast | null): void {
  cache.set(aemetId, { data, expiresAt: Date.now() + CACHE_TTL_MS })
}

/**
 * Fetches beach weather forecast from AEMET API.
 * Returns null on any error (API unavailable, missing key, etc.)
 */
export async function fetchAemetForecast(
  aemetId: string,
  apiKey: string,
): Promise<AemetBeachForecast | null> {
  const cached = getCached(aemetId)
  if (cached !== undefined) return cached

  try {
    const metaUrl = `${AEMET_BASE_URL}/prediccion/especifica/playa/${aemetId}`
    const metaRes = await fetch(metaUrl, {
      headers: { api_key: apiKey },
    })

    if (!metaRes.ok) {
      setCached(aemetId, null)
      return null
    }

    const meta = (await metaRes.json()) as AemetMetaResponse

    if (meta.estado !== 200 || !meta.datos) {
      setCached(aemetId, null)
      return null
    }

    const dataRes = await fetch(meta.datos)
    if (!dataRes.ok) {
      setCached(aemetId, null)
      return null
    }

    const rawArray = (await dataRes.json()) as Array<AemetRawPrediction>
    const raw = rawArray[0]

    if (!raw?.prediccion?.dia) {
      setCached(aemetId, null)
      return null
    }

    const forecast: AemetBeachForecast = {
      elaborado: raw.elaborado,
      dias: raw.prediccion.dia.map((d) => ({
        fecha: d.fecha,
        estadoCielo: d.estadoCielo ?? [],
        viento: d.viento ?? [],
        oleaje: d.oleaje ?? [],
        tMaxima: d.tMaxima ?? -999,
        tMinima: d.tMinima ?? -999,
        indiceUV: d.indiceUV ?? -1,
        sTermica: d.sTermica ?? {},
      })),
    }

    setCached(aemetId, forecast)
    return forecast
  } catch {
    setCached(aemetId, null)
    return null
  }
}

/**
 * Returns the best sky description for the full-day period ("00-24") or falls
 * back to the morning period ("00-12"), or the first available entry.
 */
export function getDaySkyDescription(
  estadoCielo: Array<AemetSkyPeriod>,
): AemetSkyPeriod | null {
  if (estadoCielo.length === 0) return null
  return (
    estadoCielo.find((p) => p.periodo === '00-24') ??
    estadoCielo.find((p) => p.periodo === '00-12') ??
    estadoCielo[0]
  )
}

/**
 * Returns the dominant wind period for the day (full-day or morning fallback).
 */
export function getDayWind(
  viento: Array<AemetWindPeriod>,
): AemetWindPeriod | null {
  if (viento.length === 0) return null
  return (
    viento.find((p) => p.periodo === '00-24') ??
    viento.find((p) => p.periodo === '00-12') ??
    viento[0]
  )
}
