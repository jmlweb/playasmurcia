import { describe, expect, it } from 'vitest'

import { parseCardFlagsInput } from './card-flags-input'

describe('parseCardFlagsInput', () => {
  it('accepts a list of codes', () => {
    expect(parseCardFlagsInput({ codes: ['A', 'B'] })).toEqual({
      codes: ['A', 'B'],
    })
  })

  it.each([
    ['missing codes', {}],
    ['non-array codes', { codes: 'A' }],
    ['non-string code', { codes: [1] }],
    ['empty code', { codes: [''] }],
    [
      'too many codes',
      { codes: Array.from({ length: 501 }, (_, i) => String(i)) },
    ],
  ])('rejects %s', (_label, input) => {
    expect(() => parseCardFlagsInput(input)).toThrow()
  })
})
