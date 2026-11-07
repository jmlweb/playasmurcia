import { describe, expect, it } from 'vitest'

import municipalities from '../../data/municipalities.json'
import {
  formatEurPerM2,
  formatPopulation,
  getMunicipalityFacts,
} from './municipality-facts'

describe('getMunicipalityFacts', () => {
  it('has a population with its year for all municipalities', () => {
    municipalities.forEach(({ id }) => {
      expect(getMunicipalityFacts(id).population?.year).toBe(2025)
    })
  })

  it('has an appraised value only for the five municipalities in the table', () => {
    const withValue = municipalities
      .filter(({ id }) => getMunicipalityFacts(id).appraisedValue)
      .map(({ name }) => name)
      .sort()
    expect(withValue).toEqual(
      ['Cartagena', 'Lorca', 'Mazarrón', 'San Javier', 'Águilas'].sort(),
    )
  })

  it('returns nothing for a missing figure', () => {
    const facts = getMunicipalityFacts('30036')
    expect(facts.appraisedValue).toBeUndefined()
    expect(getMunicipalityFacts('00000')).toEqual({ touristOffices: [] })
  })
})

describe('formatters', () => {
  it('uses thousands separators even for four digits', () => {
    expect(formatPopulation(20408)).toBe('20.408')
    expect(formatEurPerM2(1952.8)).toBe('1.952,8 €/m²')
  })
})
