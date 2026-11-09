import { describe, expect, it } from 'vitest'

import {
  formatBeachWidth,
  getBeachDimensions,
  getDisplayLength,
} from './beach-dimensions'

describe('getBeachDimensions', () => {
  it('reads length and width from the ITREM sheet', () => {
    const colonia = getBeachDimensions('612')
    expect(colonia?.officialLength).toBe(580)
    expect(colonia?.officialWidth).toBe(40)
  })

  it('keeps a published width range as its bounds', () => {
    const espejo = getBeachDimensions('690')
    expect(espejo?.officialWidthRange).toEqual([20, 35])
    expect(espejo?.officialWidth).toBeUndefined()
    expect(espejo && formatBeachWidth(espejo)).toBe('20–35 m')
  })
})

describe('getDisplayLength', () => {
  it('prefers the ITREM length and falls back to OSM', () => {
    expect(getDisplayLength('612', 999)).toBe(580)
    expect(getDisplayLength('000', 410)).toBe(410)
    expect(getDisplayLength('000', null)).toBeUndefined()
  })
})
