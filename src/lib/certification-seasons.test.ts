import { describe, expect, it } from 'vitest'

import { getCertificationSeasonYear } from './certification-seasons'

describe('getCertificationSeasonYear', () => {
  it('returns the 2026 season for the Blue Flag list', () => {
    expect(getCertificationSeasonYear('blue-flag')).toBe(2026)
  })

  it('returns the 2024 season for the Q de Calidad list', () => {
    expect(getCertificationSeasonYear('q-quality')).toBe(2024)
  })

  it('returns undefined when the award year is unknown', () => {
    expect(getCertificationSeasonYear('ecoplayas')).toBeUndefined()
  })
})
