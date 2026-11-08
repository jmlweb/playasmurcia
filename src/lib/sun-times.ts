/**
 * Sunrise and sunset from coordinates, after the NOAA solar calculator.
 * Accurate to about a minute, which is all a beach page needs.
 */

const MS_PER_DAY = 86_400_000
const ZENITH_WITH_REFRACTION = 90.833

const rad = (deg: number) => (deg * Math.PI) / 180
const deg = (r: number) => (r * 180) / Math.PI

export type SunTimes = {
  /** Timestamp (ms) of sunrise */
  sunrise: number
  /** Timestamp (ms) of sunset */
  sunset: number
}

/**
 * Sunrise and sunset for the calendar day that contains `dayUtcMidnight`.
 * Returns undefined when the sun never rises or sets (not on this coast).
 */
export function getSunTimes(
  latitude: number,
  longitude: number,
  dayUtcMidnight: number,
): SunTimes | undefined {
  const noon = dayUtcMidnight + MS_PER_DAY / 2
  const julianDay = noon / MS_PER_DAY + 2_440_587.5
  const t = (julianDay - 2_451_545) / 36_525

  const meanLongitude = (280.46646 + t * (36_000.76983 + t * 0.0003032)) % 360
  const meanAnomaly = 357.52911 + t * (35_999.05029 - 0.0001537 * t)
  const eccentricity = 0.016708634 - t * (0.000042037 + 0.0000001267 * t)
  const centre =
    Math.sin(rad(meanAnomaly)) * (1.914602 - t * (0.004817 + 0.000014 * t)) +
    Math.sin(rad(2 * meanAnomaly)) * (0.019993 - 0.000101 * t) +
    Math.sin(rad(3 * meanAnomaly)) * 0.000289
  const trueLongitude = meanLongitude + centre
  const omega = 125.04 - 1934.136 * t
  const apparentLongitude =
    trueLongitude - 0.00569 - 0.00478 * Math.sin(rad(omega))
  const meanObliquity =
    23 + (26 + (21.448 - t * (46.815 + t * (0.00059 - t * 0.001813))) / 60) / 60
  const obliquity = meanObliquity + 0.00256 * Math.cos(rad(omega))
  const declination = deg(
    Math.asin(Math.sin(rad(obliquity)) * Math.sin(rad(apparentLongitude))),
  )

  const y = Math.tan(rad(obliquity / 2)) ** 2
  const equationOfTime =
    4 *
    deg(
      y * Math.sin(2 * rad(meanLongitude)) -
        2 * eccentricity * Math.sin(rad(meanAnomaly)) +
        4 *
          eccentricity *
          y *
          Math.sin(rad(meanAnomaly)) *
          Math.cos(2 * rad(meanLongitude)) -
        0.5 * y * y * Math.sin(4 * rad(meanLongitude)) -
        1.25 * eccentricity * eccentricity * Math.sin(2 * rad(meanAnomaly)),
    )

  const cosHourAngle =
    Math.cos(rad(ZENITH_WITH_REFRACTION)) /
      (Math.cos(rad(latitude)) * Math.cos(rad(declination))) -
    Math.tan(rad(latitude)) * Math.tan(rad(declination))
  if (cosHourAngle < -1 || cosHourAngle > 1) return undefined
  const hourAngle = deg(Math.acos(cosHourAngle))

  const solarNoonMinutes = 720 - 4 * longitude - equationOfTime
  const sunriseMinutes = solarNoonMinutes - 4 * hourAngle
  const sunsetMinutes = solarNoonMinutes + 4 * hourAngle

  return {
    sunrise: dayUtcMidnight + sunriseMinutes * 60_000,
    sunset: dayUtcMidnight + sunsetMinutes * 60_000,
  }
}

/** UTC midnight of today's calendar day in Europe/Madrid */
export function getMadridDayUtcMidnight(now: number = Date.now()): number {
  const day = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Madrid',
  }).format(now)
  const [year, month, date] = day.split('-').map(Number)
  return Date.UTC(year, month - 1, date)
}

export function formatMadridTime(timestamp: number): string {
  return new Intl.DateTimeFormat('es-ES', {
    timeZone: 'Europe/Madrid',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(timestamp)
}

// Mean sunset azimuth over the bathing season (June to August) at 37.7° N:
// 300° in late June, 289° in late August.
export const SUMMER_SUNSET_AZIMUTH = 295
// A beach sees the sun set over the water when the sunset lies within this
// angle of its seaward bearing; beyond it the shoreline or headlands get in the way.
export const SUNSET_VIEW_HALF_WIDTH = 65

/** Whether a beach facing `shoreBearing` watches the summer sun set over the water */
export function facesSummerSunset(shoreBearing: number): boolean {
  const diff = Math.abs(
    ((shoreBearing - SUMMER_SUNSET_AZIMUTH + 540) % 360) - 180,
  )
  return diff <= SUNSET_VIEW_HALF_WIDTH
}
