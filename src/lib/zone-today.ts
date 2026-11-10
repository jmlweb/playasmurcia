import type { BeachFlag } from './beach-status-112'
import type { FlagCounts, SeaWeather } from './coast-today'
import type { CardWeather } from './open-meteo'
import type { ZoneGroup } from './zones'

import {
  countFlags,
  latestWeatherTime,
  summarizeSeaWeather,
} from './coast-today'

export type ZoneTodayRow = {
  /** Heading id of the matching zone section, used as the jump target */
  anchorId: string
  name: string
  beachCount: number
  /** Beaches the active filters leave; 0 means the zone has no section */
  shownCount: number
  weather?: SeaWeather
  flags?: FlagCounts
}

export type ZoneToday = {
  rows: ZoneTodayRow[]
  weatherTime?: string
  /** Beaches in these rows with a 112 flag today */
  flaggedCount: number
}

export const UNZONED_HEADING = 'Otras playas'

export const zoneAnchorId = (zoneId: string | undefined): string =>
  `zona-${zoneId ?? 'otras'}`

export function buildZoneToday<T extends { code: string }>({
  groups,
  weather,
  flags,
  shownCodes,
}: {
  groups: readonly ZoneGroup<T>[]
  /** Codes left by the filters; every beach counts as shown when absent */
  shownCodes?: ReadonlySet<string>
  weather: Readonly<Record<string, CardWeather>>
  flags: Readonly<Record<string, BeachFlag>>
}): ZoneToday {
  const pick = <V>(source: Readonly<Record<string, V>>, beaches: T[]): V[] =>
    beaches.flatMap(({ code }) => (code in source ? [source[code]] : []))

  const rows = groups.map(({ zone, beaches }) => {
    const summary = summarizeSeaWeather(pick(weather, beaches))
    const counts = countFlags(pick(flags, beaches))
    return {
      anchorId: zoneAnchorId(zone?.id),
      name: zone?.name ?? UNZONED_HEADING,
      beachCount: beaches.length,
      shownCount:
        shownCodes === undefined
          ? beaches.length
          : beaches.filter(({ code }) => shownCodes.has(code)).length,
      ...(summary && { weather: summary }),
      ...(counts && { flags: counts }),
    }
  })

  const all = groups.flatMap(({ beaches }) => beaches)
  const weatherTime = latestWeatherTime(pick(weather, all))
  const flaggedCount = pick(flags, all).filter(
    (flag) => flag !== 'SIN BANDERA',
  ).length

  return { rows, flaggedCount, ...(weatherTime && { weatherTime }) }
}
