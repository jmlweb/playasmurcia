import { describe, expect, it } from 'vitest'

import {
  DEFAULT_SEARCH_LIMIT,
  MAX_SEARCH_LIMIT,
  parseSearchInput,
  parseSlugInput,
} from './tool-input'

describe('parseSearchInput', () => {
  it('returns defaults for garbage input', () => {
    expect(parseSearchInput(null)).toEqual({ limit: DEFAULT_SEARCH_LIMIT })
    expect(parseSearchInput('x')).toEqual({ limit: DEFAULT_SEARCH_LIMIT })
    expect(parseSearchInput([])).toEqual({ limit: DEFAULT_SEARCH_LIMIT })
  })

  it('trims text fields and drops empty ones', () => {
    const result = parseSearchInput({
      query: '  calblanque ',
      municipality: ' ',
    })
    expect(result.query).toBe('calblanque')
    expect(result.municipality).toBeUndefined()
  })

  it('accepts a single string or an array for list fields', () => {
    expect(parseSearchInput({ services: 'Duchas' }).services).toEqual([
      'Duchas',
    ])
    expect(
      parseSearchInput({ activities: ['Buceo', '', 3, 'Kayak'] }).activities,
    ).toEqual(['Buceo', 'Kayak'])
  })

  it('only keeps flags that are true', () => {
    const result = parseSearchInput({
      dogFriendly: true,
      lifeguard: 'true',
      childSafe: false,
      nudist: 'yes',
    })
    expect(result.dogFriendly).toBe(true)
    expect(result.lifeguard).toBe(true)
    expect(result).not.toHaveProperty('childSafe')
    expect(result).not.toHaveProperty('nudist')
  })

  it('validates enums and sort', () => {
    const result = parseSearchInput({
      accessDifficulty: 'easy',
      occupancy: 'extreme',
      sort: 'length',
    })
    expect(result.accessDifficulty).toBe('easy')
    expect(result.occupancy).toBeUndefined()
    expect(result.sort).toBe('length')
    expect(parseSearchInput({ sort: 'cercania' }).sort).toBeUndefined()
  })

  it('clamps the limit', () => {
    expect(parseSearchInput({ limit: 0 }).limit).toBe(1)
    expect(parseSearchInput({ limit: 999 }).limit).toBe(MAX_SEARCH_LIMIT)
    expect(parseSearchInput({ limit: '7.9' }).limit).toBe(7)
    expect(parseSearchInput({ limit: 'many' }).limit).toBe(DEFAULT_SEARCH_LIMIT)
  })
})

describe('parseSlugInput', () => {
  it('lowercases and trims the slug', () => {
    expect(parseSlugInput({ slug: ' Cala-Cortina ' })).toEqual({
      slug: 'cala-cortina',
    })
  })

  it('throws on a missing slug', () => {
    expect(() => parseSlugInput({})).toThrow('Invalid slug')
    expect(() => parseSlugInput({ slug: '' })).toThrow('Invalid slug')
    expect(() => parseSlugInput(null)).toThrow('Invalid slug')
  })
})
