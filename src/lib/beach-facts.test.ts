import { describe, expect, it } from 'vitest'

import {
  formatBeachLength,
  formatCompassDirection,
  formatUsualWaves,
  parsePhoneNumbers,
  toTelHref,
} from './beach-facts'

describe('formatCompassDirection', () => {
  it('spells out NO so it does not read as a negation', () => {
    expect(formatCompassDirection('NO')).toBe('Noroeste')
    expect(formatCompassDirection('so')).toBe('Suroeste')
  })

  it('keeps unknown values', () => {
    expect(formatCompassDirection('Variable')).toBe('Variable')
  })
})

describe('formatUsualWaves', () => {
  it('turns the stored enum into a readable label', () => {
    expect(formatUsualWaves('TRANQUILO')).toBe('Tranquilo')
  })

  it('stays silent without a real value', () => {
    expect(formatUsualWaves('SIN DETERMINAR')).toBeUndefined()
    expect(formatUsualWaves(undefined)).toBeUndefined()
  })
})

describe('formatBeachLength', () => {
  it('keeps metres below one kilometre', () => {
    expect(formatBeachLength(356)).toBe('356 m')
  })

  it('switches to kilometres with a decimal comma', () => {
    expect(formatBeachLength(4531)).toBe('4,5 km')
    expect(formatBeachLength(2000)).toBe('2 km')
  })
})

describe('parsePhoneNumbers', () => {
  it('splits every separator the data uses', () => {
    expect(parsePhoneNumbers('968 47 37 07 / 112')).toEqual([
      '968 47 37 07',
      '112',
    ])
    expect(parsePhoneNumbers('968 473 707 /112')).toEqual([
      '968 473 707',
      '112',
    ])
  })

  it('keeps a single number whole', () => {
    expect(parsePhoneNumbers('968 12 89 55')).toEqual(['968 12 89 55'])
  })
})

describe('toTelHref', () => {
  it('removes the spaces', () => {
    expect(toTelHref('968 12 89 55')).toBe('tel:968128955')
  })
})
