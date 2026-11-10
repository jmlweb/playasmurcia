import type { ZoneToday, ZoneTodayRow } from '@/lib/zone-today'

import { FlagLine, WeatherLine } from '@/features/home/coast-today-strip'
import { OFF_SEASON_FLAG_NOTE } from '@/lib/beach-status-labels'

const countLabel = (count: number) =>
  count === 1 ? '1 playa' : `${String(count)} playas`

const sourceLine = (today: ZoneToday, expectsFlags: boolean): string => {
  const weather = today.rows.some((row) => row.weather)
    ? [['Open-Meteo', today.weatherTime].filter(Boolean).join(' · ')]
    : []
  const flags = expectsFlags
    ? today.flaggedCount > 0
      ? [
          `112 · ${today.flaggedCount === 1 ? '1 playa' : `${String(today.flaggedCount)} playas`} con bandera hoy`,
        ]
      : []
    : [OFF_SEASON_FLAG_NOTE]
  return [...weather, ...flags].join(' · ')
}

function ZoneRowBody({
  row,
  expectsFlags,
}: {
  row: ZoneTodayRow
  expectsFlags: boolean
}) {
  return (
    <span className="block min-w-0">
      <span className="flex flex-wrap items-baseline gap-x-2">
        <span
          className={`text-base font-semibold transition-colors duration-150 sm:text-lg ${row.shownCount > 0 ? 'text-gray-900 group-hover:text-ocean-600' : 'text-gray-600'}`}
        >
          {row.name}
        </span>
        <span className="text-[13px] text-gray-600 tabular-nums">
          {/* Same width as the plain count, so filtering never reflows the rows */}
          {row.shownCount === row.beachCount
            ? countLabel(row.beachCount)
            : `${String(row.shownCount)} de ${String(row.beachCount)}`}
        </span>
      </span>
      {/* Weather lands after mount: hold its line so rows do not jump */}
      {row.weather ? (
        <WeatherLine weather={row.weather} />
      ) : (
        <span className="block h-6" />
      )}
      {row.flags ? (
        <FlagLine flags={row.flags} />
      ) : (
        expectsFlags && <span className="mt-1 block h-5" />
      )}
    </span>
  )
}

type ZoneTodayStripProps = {
  municipalityName: string
  today: ZoneToday
  expectsFlags: boolean
}

/**
 * Today's conditions per zone, doubling as the index of the zone sections
 * below, so a long municipality list can be crossed without scrolling it.
 */
export function ZoneTodayStrip({
  municipalityName,
  today,
  expectsFlags,
}: ZoneTodayStripProps) {
  return (
    <section aria-labelledby="zone-today-heading" className="mb-10 sm:mb-12">
      <h2
        className="overline-accent font-sans text-sm font-semibold tracking-wider text-ocean-600 uppercase"
        id="zone-today-heading"
      >
        Hoy en {municipalityName}
      </h2>
      <ul className="mt-2 grid grid-cols-2 gap-x-4 border-b border-gray-200 sm:mt-3 sm:gap-x-8 lg:grid-cols-3 lg:gap-x-12">
        {today.rows.map((row) => (
          <li key={row.anchorId} className="border-t border-gray-200">
            {row.shownCount > 0 ? (
              <a
                className="group flex items-start justify-between gap-3 rounded-sm py-2.5 focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:ring-offset-2 focus-visible:ring-offset-sand-50 focus-visible:outline-none sm:py-3"
                href={`#${row.anchorId}`}
              >
                <ZoneRowBody expectsFlags={expectsFlags} row={row} />
                <svg
                  aria-hidden="true"
                  className="mt-1.5 hidden h-5 w-5 shrink-0 text-ocean-600 sm:block"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M8 17l4 4m0 0l4-4m-4 4V3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </a>
            ) : (
              // Filtered out: no section to jump to, but the row keeps its
              // place so the filter chips below do not move under the finger
              <div className="py-2.5 sm:py-3">
                <ZoneRowBody expectsFlags={expectsFlags} row={row} />
              </div>
            )}
          </li>
        ))}
      </ul>
      {/* Constant live region: a role that appears with its text is often not announced */}
      <p
        className="mt-2 min-h-5 text-[13px] text-gray-600 tabular-nums"
        role="status"
      >
        {sourceLine(today, expectsFlags)}
      </p>
    </section>
  )
}

type ZoneJumpBarProps = {
  rows: Pick<ZoneTodayRow, 'anchorId' | 'name' | 'beachCount'>[]
}

/** Zone links that stay under the navbar on phones and tablets. */
export function ZoneJumpBar({ rows }: ZoneJumpBarProps) {
  return (
    <nav
      aria-label="Zonas"
      className="sticky top-[4.5625rem] z-30 -mx-4 mb-6 border-b border-gray-200 bg-sand-50 px-4 sm:top-[3.8125rem] sm:-mx-6 sm:px-6 lg:hidden"
    >
      {/* The fade hints that more zones scroll in from the right */}
      <ul className="-mx-1 flex [scrollbar-width:none] gap-1 overflow-x-auto mask-[linear-gradient(to_right,black_calc(100%-2rem),transparent)]">
        {rows.map((row) => (
          <li key={row.anchorId} className="shrink-0">
            <a
              className="flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-medium whitespace-nowrap text-gray-700 transition-colors hover:text-ocean-600 focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:outline-none focus-visible:ring-inset"
              href={`#${row.anchorId}`}
            >
              {row.name}
              <span className="text-[13px] font-normal text-gray-600 tabular-nums">
                {row.beachCount}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
