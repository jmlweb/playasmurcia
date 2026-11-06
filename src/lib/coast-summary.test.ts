import { describe, expect, it } from 'vitest'

import { summarizeCoast } from '@/lib/coast-summary'

describe('summarizeCoast', () => {
  it('adds beaches and counts the municipalities that have any', () => {
    expect(
      summarizeCoast([
        { beachCount: 69 },
        { beachCount: 2 },
        { beachCount: 0 },
      ]),
    ).toStrictEqual({ beachCount: 71, municipalityCount: 2 })
  })

  it('returns zeros for an empty list', () => {
    expect(summarizeCoast([])).toStrictEqual({
      beachCount: 0,
      municipalityCount: 0,
    })
  })
})
