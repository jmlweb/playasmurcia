// Same ceiling as the card weather input: larger than any listing
const MAX_CODES = 500

export function parseCardFlagsInput(data: unknown): { codes: string[] } {
  const codes: unknown =
    typeof data === 'object' && data !== null && 'codes' in data
      ? data.codes
      : undefined
  if (
    !Array.isArray(codes) ||
    codes.length > MAX_CODES ||
    !codes.every(
      (code): code is string => typeof code === 'string' && code.length > 0,
    )
  ) {
    throw new Error('Invalid codes')
  }
  return { codes }
}
