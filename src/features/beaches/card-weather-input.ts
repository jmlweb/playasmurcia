export type CardWeatherBeach = {
  code: string
  coordinates: [number, number]
}

// Largest listing (/explorar) has ~200 beaches; cap well above that
const MAX_BEACHES = 500

function isCoordinates(value: unknown): value is [number, number] {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    typeof value[0] === 'number' &&
    typeof value[1] === 'number' &&
    Math.abs(value[0]) <= 90 &&
    Math.abs(value[1]) <= 180
  )
}

export function parseCardWeatherInput(data: unknown): {
  beaches: CardWeatherBeach[]
} {
  const beaches: unknown =
    typeof data === 'object' && data !== null && 'beaches' in data
      ? data.beaches
      : undefined
  if (!Array.isArray(beaches) || beaches.length > MAX_BEACHES) {
    throw new Error('Invalid beaches')
  }
  return {
    beaches: beaches.map((beach: unknown) => {
      if (
        typeof beach !== 'object' ||
        beach === null ||
        !('code' in beach) ||
        typeof beach.code !== 'string' ||
        !beach.code ||
        !('coordinates' in beach) ||
        !isCoordinates(beach.coordinates)
      ) {
        throw new Error('Invalid beach')
      }
      return { code: beach.code, coordinates: beach.coordinates }
    }),
  }
}
