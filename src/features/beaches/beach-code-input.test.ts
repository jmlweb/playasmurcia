import { describe, expect, it } from 'vitest'

import { parseBeachCodeInput, parseBeachCodesInput } from './beach-code-input'

describe('parseBeachCodesInput', () => {
  it('accepts a list of codes', () => {
    expect(parseBeachCodesInput({ codes: ['A', 'B'] })).toEqual({
      codes: ['A', 'B'],
    })
  })

  it('drops client-supplied coordinates', () => {
    expect(
      parseBeachCodesInput({ codes: ['A'], coordinates: [[0, 0]] }),
    ).toEqual({ codes: ['A'] })
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
    expect(() => parseBeachCodesInput(input)).toThrow()
  })
})

describe('parseBeachCodeInput', () => {
  it('accepts a code and drops anything else', () => {
    expect(
      parseBeachCodeInput({ code: 'A', aemetId: '../../x', latitude: 0 }),
    ).toEqual({ code: 'A' })
  })

  it.each([
    ['missing code', {}],
    ['non-string code', { code: 1 }],
    ['empty code', { code: '' }],
    ['null input', null],
  ])('rejects %s', (_label, input) => {
    expect(() => parseBeachCodeInput(input)).toThrow()
  })
})
