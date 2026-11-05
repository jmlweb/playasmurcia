/**
 * Extends a shorter forecast with the days the longer one has beyond its end.
 * Days both sources cover stay with the primary forecast.
 */
export function appendLaterDays<T extends { fecha: number }>(
  primary: readonly T[],
  fallback: readonly T[],
): T[] {
  const lastPrimaryDay = Math.max(...primary.map((d) => d.fecha))
  return [...primary, ...fallback.filter((d) => d.fecha > lastPrimaryDay)]
}
