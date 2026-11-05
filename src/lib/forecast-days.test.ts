import { describe, expect, it } from 'vitest'

import { appendLaterDays } from './forecast-days'

const day = (fecha: number, source: string) => ({ fecha, source })

describe('appendLaterDays', () => {
  it('adds only the days after the last primary day', () => {
    const result = appendLaterDays(
      [day(1, 'aemet'), day(2, 'aemet')],
      [day(1, 'om'), day(2, 'om'), day(3, 'om'), day(4, 'om')],
    )
    expect(result).toEqual([
      day(1, 'aemet'),
      day(2, 'aemet'),
      day(3, 'om'),
      day(4, 'om'),
    ])
  })

  it('keeps the primary days when the fallback adds nothing', () => {
    expect(appendLaterDays([day(1, 'aemet')], [day(1, 'om')])).toEqual([
      day(1, 'aemet'),
    ])
  })

  it('keeps the primary days when the fallback is empty', () => {
    expect(appendLaterDays([day(1, 'aemet')], [])).toEqual([day(1, 'aemet')])
  })
})
