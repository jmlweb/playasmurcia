import type { BeachStatus112 } from '@/lib/beach-status-112'
import type { OpenMeteoForecast } from '@/lib/open-meteo'

import { formatCompassDirection, MAR_MENOR_SEA } from '@/lib/beach-facts'
import {
  FlagLabels,
  OFF_SEASON_FLAG_NOTE,
  SeaStateLabels,
} from '@/lib/beach-status-labels'
import { formatWaveHeight } from '@/lib/wave-level'

const HEADING = '## Condiciones recientes'
const BEACH_PATH = /^\/playas\/([^/]+)\/?$/

type BeachConditionsInput = {
  checkedAt: Date
  forecast?: OpenMeteoForecast | null
  waveHeight?: number | null
  status?: BeachStatus112 | null
}

const formatDate = (date: Date): string => date.toISOString().slice(0, 10)

const formatFlagLine = (status: BeachStatus112): string =>
  `- **Bandera**: ${FlagLabels[status.flag]}, ${SeaStateLabels[status.seaState].toLowerCase()} (${status.date} ${status.time}, 112 Región de Murcia)`

/** Pure so the output can be tested without any network or database. */
export function formatBeachConditions({
  checkedAt,
  forecast,
  waveHeight,
  status,
}: BeachConditionsInput): string {
  const current = forecast?.current
  const facts = [
    ...(current
      ? [
          `- **Cielo**: ${current.skyDescription}`,
          `- **Temperatura**: ${current.temp} °C`,
          `- **Viento**: ${current.windSpeed} km/h, ${formatCompassDirection(current.windDirection)}`,
        ]
      : []),
    ...(waveHeight == null
      ? []
      : [`- **Oleaje**: ${formatWaveHeight(waveHeight)} m`]),
    ...(status && !status.isOffSeason ? [formatFlagLine(status)] : []),
  ]
  const days = (forecast?.days ?? []).map(
    (day) =>
      `- **${formatDate(new Date(day.fecha))}**: ${day.skyDescription}, máxima ${day.tMaxima} °C, mínima ${day.tMinima} °C, lluvia ${day.precipitationProbability} %`,
  )

  const sections = [
    HEADING,
    `Consultadas el ${formatDate(checkedAt)} a las ${checkedAt.toISOString().slice(11, 16)} UTC. Pueden tener hasta una hora de antigüedad.`,
    ...(facts.length > 0 ? [facts.join('\n')] : []),
    ...(status?.isOffSeason ? [OFF_SEASON_FLAG_NOTE] : []),
    ...(days.length > 0
      ? [`### Previsión (Open-Meteo)\n\n${days.join('\n')}`]
      : []),
  ]
  return facts.length === 0 && days.length === 0 && !status
    ? `${HEADING}\n\nNo disponibles en este momento.`
    : sections.join('\n\n')
}

const settled = <T>(result: PromiseSettledResult<T>): T | undefined =>
  result.status === 'fulfilled' ? result.value : undefined

async function getBeachConditionsMarkdown(
  slug: string,
  checkedAt: Date,
): Promise<string | undefined> {
  const [
    { getBeachBySlug, getMunicipality },
    { fetchMarineWeather, fetchOpenMeteoForecast },
    { getBeachStatus },
  ] = await Promise.all([
    import('@/lib/db-data/beach-queries'),
    import('@/lib/open-meteo'),
    import('@/lib/beach-status-112'),
  ])
  const beach = await getBeachBySlug(slug)
  if (!beach) return undefined
  const municipality = await getMunicipality(beach.municipality)

  const [forecast, marine, status] = await Promise.allSettled([
    fetchOpenMeteoForecast(...beach.coordinates),
    beach.sea === MAR_MENOR_SEA
      ? Promise.resolve(undefined)
      : fetchMarineWeather(...beach.coordinates),
    getBeachStatus(beach.name, municipality.name),
  ])
  return formatBeachConditions({
    checkedAt,
    forecast: settled(forecast),
    waveHeight: settled(marine)?.waveHeight,
    status: settled(status),
  })
}

/**
 * Live data reaches people through client-side widgets, which never run for a
 * markdown request, so a beach page appends the same facts on the way out.
 */
export async function withBeachConditions(
  response: Response,
  pageUrl: string,
): Promise<Response> {
  const slug = BEACH_PATH.exec(new URL(pageUrl).pathname)?.[1]
  if (!slug || response.status !== 200) return response
  const isMarkdown = (response.headers.get('content-type') ?? '').includes(
    'text/markdown',
  )
  if (!isMarkdown) return response

  const conditions = await getBeachConditionsMarkdown(
    decodeURIComponent(slug),
    new Date(),
  ).catch(() => undefined)
  if (!conditions) return response

  const markdown = await response.text()
  return new Response(`${markdown.trimEnd()}\n\n${conditions}\n`, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  })
}
