// Larger than any listing: /explorar has ~200 beaches
const MAX_CODES = 500

const isCode = (code: unknown): code is string =>
  typeof code === 'string' && code.length > 0

export function parseBeachCodesInput(data: unknown): { codes: string[] } {
  const codes: unknown =
    typeof data === 'object' && data !== null && 'codes' in data
      ? data.codes
      : undefined
  if (
    !Array.isArray(codes) ||
    codes.length > MAX_CODES ||
    !codes.every(isCode)
  ) {
    throw new Error('Invalid codes')
  }
  return { codes }
}

export function parseBeachCodeInput(data: unknown): { code: string } {
  const code: unknown =
    typeof data === 'object' && data !== null && 'code' in data
      ? data.code
      : undefined
  if (!isCode(code)) throw new Error('Invalid code')
  return { code }
}
