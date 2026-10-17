import type { OccupancyLevel } from '@/lib/beach-filters'

/**
 * Stored occupancy describes a typical peak-summer day. Outside June–September
 * every beach is quiet, so a live badge would say "low" everywhere and carry no
 * information: return undefined instead.
 */
export function seasonalOccupancy(
  stored: OccupancyLevel,
  date: Date = new Date(),
): OccupancyLevel | undefined {
  const month = date.getMonth()

  if (month === 6 || month === 7) return stored
  if (month === 5 || month === 8) return stored === 'high' ? 'medium' : stored
  return undefined
}
