import type { BeachStatus112 } from '@/lib/beach-status-112'
import type {
  BeachForecast,
  ForecastDay,
  ForecastWaves,
} from '@/lib/forecast-days'
import type { WaveExposure } from '@/lib/wave-exposure'

import { formatCompassDirection } from '@/lib/beach-facts'
import {
  FlagLabels,
  OFF_SEASON_FLAG_NOTE,
  SeaStateLabels,
} from '@/lib/beach-status-labels'
import { ForecastSourceLabel } from '@/lib/forecast-days'
import { formatWaveHeight, getWaveLevel } from '@/lib/wave-level'

const HEADING = '## Condiciones recientes'
const NO_CONDITIONS = `${HEADING}\n\nNo disponibles en este momento.`
const BEACH_PATH = /^\/playas\/([^/]+)\/?$/
// The 112 feed is parsed from raw XML and its stamp is printed verbatim
const FEED_STAMP = /^[\d/:. -]+$/

type BeachConditionsInput = {
  checkedAt: Date
  forecast?: BeachForecast | null
  status?: BeachStatus112 | null
}

const WaveExposureLabels: Record<WaveExposure, string> = {
  expuesta: 'llega de frente a la playa',
  resguardada: 'no llega de frente a la playa',
}

const formatDate = (date: Date): string => date.toISOString().slice(0, 10)

const formatFlagLine = (status: BeachStatus112): string => {
  const stamp = `${status.date} ${status.time}`
  const source = FEED_STAMP.test(stamp)
    ? `${stamp}, 112 Región de Murcia`
    : '112 Región de Murcia'
  return `- **Bandera**: ${FlagLabels[status.flag]}, ${SeaStateLabels[status.seaState].toLowerCase()} (${source})`
}

const formatWaves = ({ height, direction, exposure }: ForecastWaves): string =>
  [
    `- **Oleaje**: ${height === undefined ? '' : `${formatWaveHeight(height)} m (${getWaveLevel(height)})`}`,
    direction ? ` del ${formatCompassDirection(direction).toLowerCase()}` : '',
    exposure ? `, ${WaveExposureLabels[exposure]}` : '',
  ].join('')

const formatDay = (day: ForecastDay): string => {
  const parts = [
    day.skyDescription,
    day.tMaxima === undefined ? '' : `máxima ${day.tMaxima} °C`,
    day.tMinima === undefined ? '' : `mínima ${day.tMinima} °C`,
    day.precipitationProbability === undefined
      ? ''
      : `lluvia ${day.precipitationProbability} %`,
    day.wavesDescription ? `oleaje ${day.wavesDescription.toLowerCase()}` : '',
  ].filter(Boolean)
  return `- **${formatDate(new Date(day.fecha))}**: ${parts.join(', ')}`
}

/** Pure so the output can be tested without any network or database. */
export function formatBeachConditions({
  checkedAt,
  forecast,
  status,
}: BeachConditionsInput): string {
  const current = forecast?.current
  const facts = [
    ...(current
      ? [
          `- **Cielo**: ${current.skyDescription}`,
          `- **Temperatura**: ${current.temp} °C, sensación ${current.apparentTemp} °C`,
          `- **Viento**: ${current.windSpeed} km/h del ${formatCompassDirection(current.windDirection).toLowerCase()}`,
          `- **Índice UV**: ${current.uvIndex}`,
        ]
      : []),
    ...(forecast?.waterTemp == null
      ? []
      : [`- **Agua**: ${forecast.waterTemp} °C`]),
    ...(forecast?.waves ? [formatWaves(forecast.waves)] : []),
    ...(status && !status.isOffSeason ? [formatFlagLine(status)] : []),
  ]
  const days = (forecast?.days ?? []).map(formatDay)
  const observed = forecast?.observedAt
    ? ` Datos de las ${forecast.observedAt.slice(11, 16)}, hora de Madrid.`
    : ''

  const sections = [
    HEADING,
    `Consultadas el ${formatDate(checkedAt)} a las ${checkedAt.toISOString().slice(11, 16)} UTC.${observed}`,
    ...(facts.length > 0 ? [facts.join('\n')] : []),
    ...(status?.isOffSeason ? [OFF_SEASON_FLAG_NOTE] : []),
    ...(forecast && days.length > 0
      ? [
          `### Previsión (${ForecastSourceLabel[forecast.source]})\n\n${days.join('\n')}`,
        ]
      : []),
  ]
  return facts.length === 0 && days.length === 0 && !status
    ? NO_CONDITIONS
    : sections.join('\n\n')
}

const settled = <T>(result: PromiseSettledResult<T>): T | undefined =>
  result.status === 'fulfilled' ? result.value : undefined

const safeDecode = (slug: string): string | undefined => {
  try {
    return decodeURIComponent(slug)
  } catch {
    return undefined
  }
}

async function getBeachConditionsMarkdown(
  slug: string,
  checkedAt: Date,
): Promise<string | undefined> {
  const [
    { getBeachBySlug, getMunicipality },
    { fetchBeachForecast, withTimeout },
    { getBeachStatus },
  ] = await Promise.all([
    import('@/lib/db-data/beach-queries'),
    import('@/lib/beach-forecast'),
    import('@/lib/beach-status-112'),
  ])
  const beach = await getBeachBySlug(slug)
  if (!beach) return undefined
  const municipality = await getMunicipality(beach.municipality)

  const [forecast, status] = await Promise.allSettled([
    fetchBeachForecast(beach),
    withTimeout(getBeachStatus(beach.name, municipality.name)),
  ])
  return formatBeachConditions({
    checkedAt,
    forecast: settled(forecast),
    status: settled(status),
  })
}

// Conditions lead the page body: they are what an agent is usually asked about
const insertConditions = (markdown: string, conditions: string): string => {
  const firstSection = markdown.indexOf('\n## ')
  return firstSection === -1
    ? `${markdown.trimEnd()}\n\n${conditions}\n`
    : `${markdown.slice(0, firstSection).trimEnd()}\n\n${conditions}\n${markdown.slice(firstSection)}`
}

/**
 * Live data reaches people through client-side widgets, which never run for a
 * markdown request, so a beach page appends the same facts on the way out.
 */
export async function withBeachConditions(
  response: Response,
  pageUrl: string,
): Promise<Response> {
  const rawSlug = BEACH_PATH.exec(new URL(pageUrl).pathname)?.[1]
  const slug = rawSlug ? safeDecode(rawSlug) : undefined
  if (!slug || response.status !== 200) return response
  const isMarkdown = (response.headers.get('content-type') ?? '').includes(
    'text/markdown',
  )
  if (!isMarkdown) return response

  const conditions = await getBeachConditionsMarkdown(slug, new Date()).catch(
    () => undefined,
  )
  if (!conditions) return response

  const headers = new Headers(response.headers)
  // A short outage must not be served from the edge for the whole TTL
  if (conditions === NO_CONDITIONS) headers.set('Cache-Control', 'no-store')
  const markdown = await response.text()
  return new Response(insertConditions(markdown, conditions), {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}
