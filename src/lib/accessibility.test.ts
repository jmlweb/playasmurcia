import { describe, expect, it } from 'vitest'

import beaches from '../../data/beaches.json'
import services from '../../data/services.json'
import { getAccessibilitySheet } from './accessibility'

const ASSISTED_BATHING = services.findIndex((s) => s.id === 'assisted-bathing')

describe('getAccessibilitySheet', () => {
  it('cites a 2026 ITREM sheet for every entry', () => {
    const codes = beaches
      .map((beach) => beach.code)
      .filter((code) => getAccessibilitySheet(code))
    expect(codes.length).toBeGreaterThan(60)
    codes.forEach((code) => {
      const sheet = getAccessibilitySheet(code)
      expect(sheet?.year, code).toBe(2026)
      expect(sheet?.sourceUrl, code).toContain(`playa-${code}/`)
    })
  })

  it('marks staff-assisted bathing as the assisted-bathing service', () => {
    expect(ASSISTED_BATHING).toBeGreaterThan(0)
    beaches.forEach((beach) => {
      const staff =
        getAccessibilitySheet(beach.code)?.assistedBathing === 'staff'
      expect(
        (beach.services as number[]).includes(ASSISTED_BATHING),
        beach.name,
      ).toBe(staff)
    })
  })

  it('reads La Colonia as staff-assisted with two chairs and an in-sea zone', () => {
    const sheet = getAccessibilitySheet('612')
    expect(sheet?.assistedBathing).toBe('staff')
    expect(sheet?.amphibiousChairs).toBe(2)
    expect(sheet?.adaptedBathingZone).toBe(true)
    expect(sheet?.season).toContain('01/07/26')
  })
})
