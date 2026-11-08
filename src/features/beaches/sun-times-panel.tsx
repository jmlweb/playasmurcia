import {
  formatMadridTime,
  getMadridDayUtcMidnight,
  getSunTimes,
} from '@/lib/sun-times'

type SunTimesPanelProps = {
  coordinates: [number, number]
  /** Derived from shoreBearing (puesta-sol tag): the summer sun sets over the water */
  sunsetOverWater?: boolean
  /** Timestamp to compute for; defaults to now (tests pass a fixed one) */
  now?: number
}

/**
 * Today's sunrise and sunset, computed from the coordinates: no upstream, so
 * it never goes silent like the live widgets can.
 */
export function SunTimesPanel({
  coordinates,
  sunsetOverWater = false,
  now,
}: SunTimesPanelProps) {
  const [latitude, longitude] = coordinates
  const times = getSunTimes(latitude, longitude, getMadridDayUtcMidnight(now))
  if (!times) return null

  return (
    <section
      aria-labelledby="sun-times-heading"
      className="rounded-2xl bg-ocean-50 px-5 py-4"
    >
      <h2
        className="text-sm font-semibold tracking-wider text-ocean-700 uppercase"
        id="sun-times-heading"
      >
        Sol hoy
      </h2>
      <p className="mt-1 text-sm text-gray-900 tabular-nums">
        <span>Amanece a las {formatMadridTime(times.sunrise)}</span>
        <span aria-hidden="true"> · </span>
        <span>Se pone a las {formatMadridTime(times.sunset)}</span>
      </p>
      {sunsetOverWater && (
        <p className="mt-1 text-sm text-gray-700">
          Esta orilla mira a poniente: en verano el sol se pone sobre el agua.
        </p>
      )}
    </section>
  )
}
