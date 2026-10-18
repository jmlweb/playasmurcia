import { describe, expect, it } from 'vitest'

import { formatWaveHeight, getWaveLevel } from './wave-level'

describe('getWaveLevel', () => {
  it('returns bajo below 0.5 m', () => {
    expect(getWaveLevel(0)).toBe('bajo')
    expect(getWaveLevel(0.49)).toBe('bajo')
  })

  it('returns moderado from 0.5 m up to 1.25 m', () => {
    expect(getWaveLevel(0.5)).toBe('moderado')
    expect(getWaveLevel(1.24)).toBe('moderado')
  })

  it('returns alto from 1.25 m', () => {
    expect(getWaveLevel(1.25)).toBe('alto')
    expect(getWaveLevel(3)).toBe('alto')
  })
})

describe('formatWaveHeight', () => {
  it('uses one decimal and a decimal comma', () => {
    expect(formatWaveHeight(0.42)).toBe('0,4')
    expect(formatWaveHeight(1)).toBe('1,0')
    expect(formatWaveHeight(1.25)).toBe('1,3')
  })
})
