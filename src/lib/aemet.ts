import { edgeCacheGet, edgeCacheSet } from './edge-cache'

const AEMET_BASE_URL = 'https://opendata.aemet.es/opendata/api'
const CACHE_TTL_SECONDS = 30 * 60 // 30 minutes
const CACHE_NS = 'aemet'

export type AemetDayParts = {
  morning: string
  afternoon: string
}

export type AemetForecastDay = {
  fecha: number
  estadoCielo: AemetDayParts
  viento: AemetDayParts
  oleaje: AemetDayParts
  tMaxima: number
  tAgua?: number
  uvMax: number
}

export type AemetBeachForecast = {
  elaborado: string
  dias: AemetForecastDay[]
}

type AemetMetaResponse = {
  estado: number
  datos: string
  descripcion?: string
}

type AemetRawDayParts = {
  descripcion1?: string
  descripcion2?: string
}

type AemetRawValue = {
  valor1?: number
}

type AemetRawDay = {
  fecha: number
  estadoCielo?: AemetRawDayParts
  viento?: AemetRawDayParts
  oleaje?: AemetRawDayParts
  tMaxima?: AemetRawValue
  tAgua?: AemetRawValue
  uvMax?: AemetRawValue
}

type AemetRawPrediction = {
  elaborado: string
  prediccion: {
    dia: AemetRawDay[]
  }
}

function toDayParts(raw: AemetRawDayParts | undefined): AemetDayParts {
  return {
    morning: raw?.descripcion1 ?? '',
    afternoon: raw?.descripcion2 ?? '',
  }
}

// AEMET sends dates as the number 20261104. UTC midnight matches what
// open-meteo.ts produces, so both sources share one day representation.
function parseAemetDate(fecha: number): number {
  const digits = String(fecha)
  return Date.UTC(
    Number(digits.slice(0, 4)),
    Number(digits.slice(4, 6)) - 1,
    Number(digits.slice(6, 8)),
  )
}

// The datos endpoint declares ISO-8859-15, which Response.json() would read as
// UTF-8, garbling Spanish diacritics.
async function readJsonWithDeclaredCharset<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') ?? ''
  const charset = /charset=([^;\s]+)/i.exec(contentType)?.[1] ?? 'utf-8'
  const body = new TextDecoder(charset).decode(await response.arrayBuffer())
  return JSON.parse(body) as T
}

/**
 * Fetches beach weather forecast from AEMET API.
 * Returns null on any error (API unavailable, missing key, etc.)
 */
export async function fetchAemetForecast(
  aemetId: string,
  apiKey: string,
): Promise<AemetBeachForecast | null> {
  const cached = await edgeCacheGet<AemetBeachForecast | null>(
    CACHE_NS,
    aemetId,
  )
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

    const rawArray =
      await readJsonWithDeclaredCharset<AemetRawPrediction[]>(dataRes)
    const raw = rawArray[0]

    if (!raw?.prediccion?.dia) {
      await edgeCacheSet(CACHE_NS, aemetId, null, CACHE_TTL_SECONDS)
      return null
    }

    const forecast: AemetBeachForecast = {
      elaborado: raw.elaborado,
      dias: raw.prediccion.dia.map((d) => ({
        fecha: parseAemetDate(d.fecha),
        estadoCielo: toDayParts(d.estadoCielo),
        viento: toDayParts(d.viento),
        oleaje: toDayParts(d.oleaje),
        tMaxima: d.tMaxima?.valor1 ?? -999,
        tAgua: d.tAgua?.valor1,
        uvMax: d.uvMax?.valor1 ?? -1,
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
 * AEMET has no full-day value, so the morning forecast speaks for the day and
 * the afternoon one only fills in when the morning is missing.
 */
export function getDayDescription(parts: AemetDayParts): string {
  return parts.morning || parts.afternoon
}

/**
 * AEMET keeps yesterday in the payload until its morning update, and the widget
 * treats the first day as today.
 */
export function dropPastDays(
  dias: readonly AemetForecastDay[],
  now: Date,
): AemetForecastDay[] {
  const madridToday = Date.parse(
    new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid' }).format(now),
  )
  return dias.filter((d) => d.fecha >= madridToday)
}
