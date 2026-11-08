// Curated from official sources; see docs/data-schema.md (Municipality facts).
import facts from '../../data/municipality-facts.json'

export type TouristOffice = {
  name: string
  address: string
  phone: string
  url: string
}

export type TouristHousing = {
  homes: number
  beds: number
  /** Share of the municipality's housing stock, in percent */
  sharePercent: number
}

export type MunicipalityFacts = {
  population?: { value: number; year: number }
  appraisedValue?: { eurPerM2: number; quarter: string }
  /** Net income per person (euros), ADRH */
  income?: { eurPerPerson: number; year: number }
  touristHousing?: TouristHousing & { period: string }
  touristOffices: TouristOffice[]
}

export type FactSources = {
  population: { label: string; url: string }
  appraisedValue: { label: string; url: string }
  regionalAppraisedValue: number
  income: { label: string; url: string; note: string; nationalAverage: number }
  touristHousing: {
    label: string
    url: string
    releaseFrequency: string
    nationalSharePercent: number
  }
  touristOfficesVerifiedOn: string
}

const populationValues: Record<string, number> = facts.population.values
const appraisedValues: Record<string, number> = facts.appraisedValue.values
const incomeValues: Record<string, number> = facts.income.values
const touristHousingValues: Record<string, TouristHousing> =
  facts.touristHousing.values
const officeValues: Record<string, TouristOffice[]> =
  facts.touristOffices.values

export const factSources: FactSources = {
  population: {
    label: facts.population.source,
    url: facts.population.sourceUrl,
  },
  appraisedValue: {
    label: facts.appraisedValue.source,
    url: facts.appraisedValue.sourceUrl,
  },
  regionalAppraisedValue: facts.appraisedValue.regionalAverage,
  income: {
    label: facts.income.source,
    url: facts.income.sourceUrl,
    note: facts.income.note,
    nationalAverage: facts.income.nationalAverage,
  },
  touristHousing: {
    label: facts.touristHousing.source,
    url: facts.touristHousing.sourceUrl,
    releaseFrequency: facts.touristHousing.releaseFrequency,
    nationalSharePercent: facts.touristHousing.nationalSharePercent,
  },
  touristOfficesVerifiedOn: facts.touristOffices.verifiedOn,
}

// Missing figures stay absent: the page shows nothing rather than an estimate
export const getMunicipalityFacts = (ineCode: string): MunicipalityFacts => {
  const population = populationValues[ineCode]
  const eurPerM2 = appraisedValues[ineCode]
  const eurPerPerson = incomeValues[ineCode]
  const housing = touristHousingValues[ineCode]
  return {
    ...(population === undefined
      ? {}
      : { population: { value: population, year: facts.population.year } }),
    ...(eurPerM2 === undefined
      ? {}
      : {
          appraisedValue: {
            eurPerM2,
            quarter: facts.appraisedValue.quarter,
          },
        }),
    ...(eurPerPerson === undefined
      ? {}
      : { income: { eurPerPerson, year: facts.income.year } }),
    ...(housing === undefined
      ? {}
      : {
          touristHousing: { ...housing, period: facts.touristHousing.period },
        }),
    touristOffices: officeValues[ineCode] ?? [],
  }
}

// es-ES skips the separator on four digits by default; these figures need it
const groupThousands = (digits: string): string =>
  digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.')

export const formatPopulation = (value: number): string =>
  groupThousands(String(Math.round(value)))

export const formatEurPerM2 = (value: number): string => {
  const [whole = '0', decimal = '0'] = value.toFixed(1).split('.')
  return `${groupThousands(whole)},${decimal} €/m²`
}

export const formatEuros = (value: number): string =>
  `${groupThousands(String(Math.round(value)))} €`

export const formatPercent = (value: number): string =>
  `${value.toFixed(2).replace('.', ',')} %`
