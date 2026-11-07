// Index into data/seas.json; the lagoon is not exposed to open-sea waves
export const MAR_MENOR_SEA = 1

const CompassDirections: Record<string, string> = {
  N: 'Norte',
  NE: 'Noreste',
  E: 'Este',
  SE: 'Sureste',
  S: 'Sur',
  SO: 'Suroeste',
  O: 'Oeste',
  NO: 'Noroeste',
  C: 'Calma',
}

/** Spelled out because a bare "NO" reads as a negation in Spanish. */
export function formatCompassDirection(direction: string): string {
  return CompassDirections[direction.toUpperCase()] ?? direction
}

const UsualWaves: Record<string, string> = {
  TRANQUILO: 'Tranquilo',
  SUAVE: 'Suave',
  MODERADO: 'Moderado',
}

/** Undefined for records without a real value such as "SIN DETERMINAR". */
export function formatUsualWaves(
  waves: string | undefined,
): string | undefined {
  return waves ? UsualWaves[waves] : undefined
}

const KILOMETRE_METRES = 1000

export function formatBeachLength(metres: number): string {
  if (metres < KILOMETRE_METRES) return `${metres} m`
  const kilometres = Math.round(metres / 100) / 10
  return `${String(kilometres).replace('.', ',')} km`
}

/** One data field can hold several numbers, e.g. "968 47 37 07 / 112". */
export function parsePhoneNumbers(phone: string): string[] {
  return phone
    .split(/[/,]/)
    .map((part) => part.trim())
    .filter((part) => part.length > 0)
}

export const toTelHref = (phoneNumber: string): string =>
  `tel:${phoneNumber.replaceAll(' ', '')}`
