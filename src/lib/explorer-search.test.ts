import { describe, expect, it } from 'vitest'

import {
  keepUnsettledFlagGreen,
  mergeExplorerSearch,
  validateListingSearch,
  validateMunicipalitySearch,
  validateSearch,
} from './explorer-search'

describe('validateSearch need filters', () => {
  it('accepts boolean and string true flags', () => {
    const result = validateSearch({ dogFriendly: true, lifeguard: 'true' })

    expect(result.dogFriendly).toBe(true)
    expect(result.lifeguard).toBe(true)
    expect(result.nudist).toBeUndefined()
  })

  it('drops false and unknown flag values', () => {
    const result = validateSearch({ dogFriendly: false, childSafe: 'yes' })

    expect(result.dogFriendly).toBeUndefined()
    expect(result.childSafe).toBeUndefined()
  })

  it('keeps only valid access and occupancy levels', () => {
    const result = validateSearch({
      accessDifficulty: ['easy', 'bogus', 'easy'],
      occupancy: 'low',
    })

    expect(result.accessDifficulty).toEqual(['easy'])
    expect(result.occupancy).toEqual(['low'])
  })

  it('returns undefined when no valid level remains', () => {
    expect(validateSearch({ occupancy: ['nope'] }).occupancy).toBeUndefined()
    expect(validateSearch({}).accessDifficulty).toBeUndefined()
  })
})

describe('validateSearch id filters', () => {
  it('keeps integer ids given as numbers or strings', () => {
    expect(validateSearch({ municipality: 1 }).municipality).toEqual([1])
    expect(validateSearch({ municipality: '2' }).municipality).toEqual([2])
    expect(validateSearch({ sea: ['1', 2] }).sea).toEqual([1, 2])
  })

  it('drops an empty value instead of reading it as id 0', () => {
    expect(validateSearch({ municipality: '' }).municipality).toBeUndefined()
    expect(validateSearch({ municipality: [''] }).municipality).toBeUndefined()
  })

  it('drops non-integer and negative ids', () => {
    expect(validateSearch({ municipality: '1.5' }).municipality).toBeUndefined()
    expect(validateSearch({ municipality: 1.5 }).municipality).toBeUndefined()
    expect(validateSearch({ municipality: '-1' }).municipality).toBeUndefined()
    expect(validateSearch({ municipality: -1 }).municipality).toBeUndefined()
    expect(
      validateSearch({ services: ['1', '-3', '2.5', 'x'] }).services,
    ).toEqual([1])
  })

  it('rejects prototype keys as enum values', () => {
    expect(
      validateSearch({ accessDifficulty: 'toString' }).accessDifficulty,
    ).toBeUndefined()
    expect(
      validateSearch({ occupancy: 'constructor' }).occupancy,
    ).toBeUndefined()
    expect(
      validateMunicipalitySearch({ accessDifficulty: ['hasOwnProperty'] })
        .accessDifficulty,
    ).toBeUndefined()
  })
})

describe('validateSearch id hardening', () => {
  it('drops blank, exponent, hex, unsafe and -0 ids', () => {
    expect(validateSearch({ municipality: ' ' }).municipality).toBeUndefined()
    expect(validateSearch({ municipality: '1e3' }).municipality).toBeUndefined()
    expect(
      validateSearch({ municipality: '0x10' }).municipality,
    ).toBeUndefined()
    expect(
      validateSearch({ municipality: '9007199254740993' }).municipality,
    ).toBeUndefined()
    expect(validateSearch({ municipality: 1e21 }).municipality).toBeUndefined()
    expect(
      validateSearch({ municipality: Infinity }).municipality,
    ).toBeUndefined()
    expect(validateSearch({ municipality: true }).municipality).toBeUndefined()
    expect(validateSearch({ municipality: [] }).municipality).toBeUndefined()
    expect(
      Object.is(validateSearch({ municipality: -0 }).municipality?.[0], 0),
    ).toBe(true)
  })

  it('dedupes ids and keeps the valid ones from a mixed array', () => {
    expect(
      validateSearch({ municipality: ['1', '', '1', 2] }).municipality,
    ).toEqual([1, 2])
  })

  it('drops unsafe page numbers', () => {
    expect(validateSearch({ page: 1e300 }).page).toBeUndefined()
  })
})

describe('validateSearch page', () => {
  it('keeps whole pages from 1 and floors fractions', () => {
    expect(validateSearch({ page: 1 }).page).toBe(1)
    expect(validateSearch({ page: 3 }).page).toBe(3)
    expect(validateSearch({ page: 2.7 }).page).toBe(2)
  })

  it('drops pages that floor below 1', () => {
    expect(validateSearch({ page: 0.5 }).page).toBeUndefined()
    expect(validateSearch({ page: 0 }).page).toBeUndefined()
    expect(validateSearch({ page: -2 }).page).toBeUndefined()
    expect(validateListingSearch({ page: 0.5 }).page).toBeUndefined()
    expect(validateMunicipalitySearch({ page: 0 }).page).toBeUndefined()
  })

  it('drops non-finite and non-numeric pages', () => {
    expect(validateSearch({ page: Number.NaN }).page).toBeUndefined()
    expect(
      validateSearch({ page: Number.POSITIVE_INFINITY }).page,
    ).toBeUndefined()
    expect(validateSearch({ page: '2' }).page).toBeUndefined()
  })
})

describe('validateSearch view', () => {
  it('keeps the map view and drops anything else', () => {
    expect(validateSearch({ view: 'map' }).view).toBe('map')
    expect(validateSearch({ view: 'list' }).view).toBeUndefined()
  })
})

describe('validateListingSearch', () => {
  it('keeps sort and page', () => {
    expect(validateListingSearch({ sort: 'name', page: 2 })).toEqual({
      sort: 'name',
      page: 2,
    })
  })

  it('drops nearby sort, which a listing without a position cannot honour', () => {
    expect(validateListingSearch({ sort: 'cercania' }).sort).toBeUndefined()
  })
})

describe('validateMunicipalitySearch', () => {
  it('keeps the filters the page offers', () => {
    expect(
      validateMunicipalitySearch({
        dogFriendly: true,
        occupancy: ['low'],
        accessDifficulty: ['easy'],
      }),
    ).toMatchObject({
      dogFriendly: true,
      occupancy: ['low'],
      accessDifficulty: ['easy'],
    })
  })

  it('ignores filters the page cannot show', () => {
    const result = validateMunicipalitySearch({ q: 'cala', municipality: [1] })

    expect(result).not.toHaveProperty('q')
    expect(result).not.toHaveProperty('municipality')
  })
})

describe('mergeExplorerSearch', () => {
  const prev = {
    lifeguard: true,
    blueFlag: true,
    flagGreen: true,
    nudist: true,
    sea: [1],
    q: 'cala',
    sort: 'name',
    page: 3,
  } as const

  it('clears boolean filters that next leaves out', () => {
    const result = mergeExplorerSearch({ ...prev, sea: [1] }, { sort: 'name' })

    expect(result).toMatchObject({
      lifeguard: undefined,
      blueFlag: undefined,
      flagGreen: undefined,
      nudist: undefined,
      sea: undefined,
      q: undefined,
      sort: 'name',
      page: undefined,
    })
  })

  it('keeps the boolean filters next carries', () => {
    const result = mergeExplorerSearch(
      { ...prev, sea: [1] },
      { lifeguard: true },
    )

    expect(result.lifeguard).toBe(true)
    expect(result.blueFlag).toBeUndefined()
  })

  it('keeps sort when next omits it, and drops page 1 and empty arrays', () => {
    const result = mergeExplorerSearch({ ...prev, sea: [1] }, { sea: [] }, 1)

    expect(result.sort).toBe('name')
    expect(result.sea).toBeUndefined()
    expect(result.page).toBeUndefined()
  })

  it('sets a later page', () => {
    expect(mergeExplorerSearch({}, {}, 2).page).toBe(2)
  })
})

describe('keepUnsettledFlagGreen', () => {
  const prev = { flagGreen: true as const, sort: 'name' as const }

  it('carries flagGreen from the URL while flags are not settled', () => {
    expect(keepUnsettledFlagGreen(prev, { sort: 'length' }, false)).toEqual({
      sort: 'length',
      flagGreen: true,
    })
  })

  it('leaves the selection alone once flags are settled', () => {
    expect(keepUnsettledFlagGreen(prev, { sort: 'length' }, true)).toEqual({
      sort: 'length',
    })
  })

  it('does nothing when the URL has no flagGreen', () => {
    expect(keepUnsettledFlagGreen({}, { sort: 'length' }, false)).toEqual({
      sort: 'length',
    })
  })

  it('keeps flagGreen in the URL across an early filter change', () => {
    const next = keepUnsettledFlagGreen(prev, { services: [1] }, false)
    expect(mergeExplorerSearch(prev, next).flagGreen).toBe(true)
  })
})
