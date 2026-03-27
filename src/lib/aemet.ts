import { edgeCacheGet, edgeCacheSet } from './edge-cache'

const AEMET_BASE_URL = 'https://opendata.aemet.es/opendata/api'
const CACHE_TTL_SECONDS = 30 * 60 // 30 minutes
const CACHE_NS = 'aemet'

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

/**
 * Fetches beach weather forecast from AEMET API.
 * Returns null on any error (API unavailable, missing key, etc.)
 */
export async function fetchAemetForecast(
  aemetId: string,
  apiKey: string,
): Promise<AemetBeachForecast | null> {
  const cached = await edgeCacheGet<AemetBeachForecast | null>(CACHE_NS, aemetId)
  if (cached !== undefined) return cached

  try {
    const metaUrl = `${AEMET_BASE_URL}/prediccion/especifica/playa/${aemetId}`
    const metaRes = await fetch(metaUrl, {
      headers: { api_key: apiKey },
    })

    if (!metaRes.ok) {
      await edgeCacheSet(CACHE_NS, aemetId, null, CACHE_TTL_SECONDS)
      return null
    }

    const meta = (await metaRes.json()) as AemetMetaResponse

    if (meta.estado !== 200 || !meta.datos) {
      await edgeCacheSet(CACHE_NS, aemetId, null, CACHE_TTL_SECONDS)
      return null
    }

    const dataRes = await fetch(meta.datos)
    if (!dataRes.ok) {
      await edgeCacheSet(CACHE_NS, aemetId, null, CACHE_TTL_SECONDS)
      return null
    }

    const rawArray = (await dataRes.json()) as Array<AemetRawPrediction>
    const raw = rawArray[0]

    if (!raw?.prediccion?.dia) {
      await edgeCacheSet(CACHE_NS, aemetId, null, CACHE_TTL_SECONDS)
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

    await edgeCacheSet(CACHE_NS, aemetId, forecast, CACHE_TTL_SECONDS)
    return forecast
  } catch {
    await edgeCacheSet(CACHE_NS, aemetId, null, CACHE_TTL_SECONDS)
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
