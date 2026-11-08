// Official length and average width from the ITREM beach sheets; see docs/data-schema.md.
import dimensions from '../../data/beach-dimensions.json'

export type BeachDimensions = {
  /** Metres, as published by ITREM */
  officialLength?: number
  /** Metres; a published range such as "20-35" is stored as its bounds */
  officialWidth?: number
  officialWidthRange?: [number, number]
  sourceUrl: string
}

const values = dimensions.values as Record<string, BeachDimensions>

export const dimensionsSource = {
  label: dimensions.source,
  fetchedOn: dimensions.fetchedOn,
}

export const getBeachDimensions = (code: string): BeachDimensions | undefined =>
  values[code]

/** The length the site shows and scores: ITREM when published, else OSM */
export const getDisplayLength = (
  code: string,
  osmLength: number | null | undefined,
): number | undefined => values[code]?.officialLength ?? osmLength ?? undefined

export function formatBeachWidth(
  dimensions: BeachDimensions,
): string | undefined {
  if (dimensions.officialWidthRange) {
    const [min, max] = dimensions.officialWidthRange
    return `${String(min)}–${String(max)} m`
  }
  return dimensions.officialWidth === undefined
    ? undefined
    : `${String(dimensions.officialWidth)} m`
}
