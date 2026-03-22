
import beachesData from "../../data/beaches.json"
import municipalitiesData from "../../data/municipalities.json"
import servicesData from "../../data/services.json"
import type { Beach, Municipality, Service } from "@/types/beach"

export const beaches = beachesData as Array<Beach>
export const municipalities = municipalitiesData as Array<Municipality>
export const services = servicesData as Array<Service>

export function getBeachByCode(code: string): Beach | undefined {
  return beaches.find((beach) => beach.code === code)
}

export function getBeachBySlug(slug: string): Beach | undefined {
  return beaches.find(
    (beach) =>
      beach.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-") === slug,
  )
}

export function beachToSlug(beach: Beach): string {
  return beach.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
}

export function getMunicipality(index: number): Municipality {
  return municipalities[index]
}

export function getService(index: number): Service {
  return services[index]
}
