import { describe, expect, it } from 'vitest'

import { parseCardWeatherInput } from './card-weather-input'

describe('parseCardWeatherInput', () => {
  it('keeps only code and coordinates', () => {
    const result = parseCardWeatherInput({
      beaches: [{ code: 'A', coordinates: [37.6, -0.8], name: 'Extra' }],
    })

    expect(result).toEqual({
      beaches: [{ code: 'A', coordinates: [37.6, -0.8] }],
    })
  })

  it('accepts an empty list', () => {
    expect(parseCardWeatherInput({ beaches: [] })).toEqual({ beaches: [] })
  })

  it.each([
    ['missing beaches', {}],
    ['non-array beaches', { beaches: 'A' }],
    ['missing code', { beaches: [{ coordinates: [37.6, -0.8] }] }],
    ['empty code', { beaches: [{ code: '', coordinates: [37.6, -0.8] }] }],
    [
      'out-of-range latitude',
      { beaches: [{ code: 'A', coordinates: [91, 0] }] },
    ],
    [
      'non-numeric coordinate',
      { beaches: [{ code: 'A', coordinates: ['1', 0] }] },
    ],
    [
      'too many beaches',
      {
        beaches: Array.from({ length: 501 }, (_, i) => ({
          code: String(i),
          coordinates: [37.6, -0.8],
        })),
      },
    ],
  ])('rejects %s', (_label, input) => {
    expect(() => parseCardWeatherInput(input)).toThrow()
  })
})
