import type { BeachFlag } from './beach-status-112'
import type { CardWeather } from './open-meteo'

import { SEA_MAR_MENOR, SEA_MEDITERRANEO } from './collections'

export type CountedFlag = Exclude<BeachFlag, 'SIN BANDERA'>
export type FlagCounts = Partial<Record<CountedFlag, number>>
export type ValueRange = { min: number; max: number }

export type SeaWeather = {
  temp: ValueRange
  wind?: ValueRange
  // Absent when the reference points disagree: one glyph would misstate them
  icon?: string
}

export type SeaToday = { weather?: SeaWeather; flags?: FlagCounts }

export const CoastSeas = [
  {
    slug: 'mar-menor',
    name: 'Mar Menor',
    sea: SEA_MAR_MENOR,
    // North, west and south shores of the lagoon
    referenceCodes: ['668', '692', '676'],
  },
  {
    slug: 'mar-mediterraneo',
    name: 'Mediterráneo',
    sea: SEA_MEDITERRANEO,
    // One point per stretch: La Manga, Cartagena, La Azohía, Mazarrón, Águilas
    referenceCodes: ['562', '512', '524', '645', '589'],
  },
] as const

export type CoastSeaSlug = (typeof CoastSeas)[number]['slug']

export type CoastToday = {
  seas: Partial<Record<CoastSeaSlug, SeaToday>>
  weatherTime?: string
  flagsTime?: string
}

export const coastReferenceCodes = (): string[] =>
  CoastSeas.flatMap(({ referenceCodes }) => [...referenceCodes])

export const countBeachesBySea = (
  beaches: readonly { sea: number }[],
): Record<CoastSeaSlug, number> =>
  Object.fromEntries(
    CoastSeas.map(({ slug, sea }) => [
      slug,
      beaches.filter((beach) => beach.sea === sea).length,
    ]),
  ) as Record<CoastSeaSlug, number>

const toRange = (values: number[]): ValueRange => ({
  min: Math.min(...values),
  max: Math.max(...values),
})

export function summarizeSeaWeather(
  points: readonly CardWeather[],
): SeaWeather | undefined {
  if (points.length === 0) return undefined

  const winds = points.flatMap(({ windSpeed }) =>
    windSpeed === undefined ? [] : [windSpeed],
  )
  const icons = new Set(points.map(({ icon }) => icon))
  const [onlyIcon] = icons

  return {
    temp: toRange(points.map(({ temp }) => temp)),
    ...(winds.length > 0 && { wind: toRange(winds) }),
    ...(icons.size === 1 && { icon: onlyIcon }),
  }
}

export function countFlags(
  flags: readonly BeachFlag[],
): FlagCounts | undefined {
  const counted = flags.filter(
    (flag): flag is CountedFlag => flag !== 'SIN BANDERA',
  )
  if (counted.length === 0) return undefined

  return counted.reduce<FlagCounts>(
    (counts, flag) => ({ ...counts, [flag]: (counts[flag] ?? 0) + 1 }),
    {},
  )
}

// HH:MM of the newest reading, from timestamps like 2026-07-14T11:15
export const latestWeatherTime = (
  points: Iterable<CardWeather>,
): string | undefined =>
  [...points]
    .flatMap(({ observedAt }) => (observedAt ? [observedAt] : []))
    .reduce<string | undefined>(
      (latest, time) => (latest === undefined || time > latest ? time : latest),
      undefined,
    )
    ?.slice(11, 16)

// The 112 feed only carries flags in summer; its last 2026 entries are from
// mid-September. Outside these months the strip must not hold room for them.
export const isFlagSeason = (date: Date = new Date()): boolean => {
  const month = date.getMonth()
  return month >= 5 && month <= 8
}

export function buildCoastToday({
  beaches,
  weather,
  flags,
  flagsTime,
}: {
  beaches: readonly { code: string; sea: number }[]
  weather: ReadonlyMap<string, CardWeather>
  flags: ReadonlyMap<string, BeachFlag>
  flagsTime?: string
}): CoastToday {
  const seas = Object.fromEntries(
    CoastSeas.map(({ slug, sea, referenceCodes }) => {
      const points = referenceCodes.flatMap((code) => {
        const point = weather.get(code)
        return point ? [point] : []
      })
      const seaFlags = beaches
        .filter((beach) => beach.sea === sea)
        .flatMap(({ code }) => {
          const flag = flags.get(code)
          return flag ? [flag] : []
        })
      const summary = summarizeSeaWeather(points)
      const counts = countFlags(seaFlags)
      return [
        slug,
        {
          ...(summary && { weather: summary }),
          ...(counts && { flags: counts }),
        },
      ]
    }),
  )

  const weatherTime = latestWeatherTime(weather.values())

  return {
    seas,
    ...(weatherTime && { weatherTime }),
    ...(flagsTime && { flagsTime }),
  }
}

export const formatRange = ({ min, max }: ValueRange): string =>
  min === max ? String(min) : `${String(min)}–${String(max)}`
