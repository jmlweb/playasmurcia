// Marine reserves shown at zone level; see docs/data-schema.md.
import reserves from '../../data/marine-reserves.json'

export type MarineReserve = {
  name: string
  /** Zone ids from data/zones.json whose beaches get the notice */
  zones: string[]
  areaHectares: number
  createdYear: number
  summary: string
  integralZone: string
  diving: string
  sources: { label: string; url: string }[]
  note?: string
}

const values: Record<string, MarineReserve> = reserves.values

export const getMarineReserveForZone = (
  zone: string | undefined,
): MarineReserve | undefined =>
  zone === undefined
    ? undefined
    : Object.values(values).find((reserve) => reserve.zones.includes(zone))
