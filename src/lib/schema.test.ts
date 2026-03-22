import { describe, expect, it } from "vitest"
import { generateBeachSchema } from "./schema"
import type { Beach, Municipality, Service } from "@/types/beach"

describe("generateBeachSchema", () => {
  const mockMunicipality: Municipality = {
    name: "Cartagena",
    id: "30016",
  }

  const mockServices: Array<Service> = [
    { id: "parking", name: "Parking", icon: "parking" },
    { id: "showers", name: "Duchas", icon: "showers" },
    { id: "toilets", name: "Aseos", icon: "toilets" },
    { id: "footwash", name: "Lavapiés", icon: "footwash" },
    { id: "umbrellas", name: "Sombrillas", icon: "umbrellas" },
    { id: "sunbeds", name: "Hamacas", icon: "sunbeds" },
    { id: "chiringuito", name: "Chiringuito", icon: "restaurant" },
    { id: "first-aid", name: "Primeros Auxilios", icon: "first-aid" },
    { id: "wheelchair-ramp", name: "Rampa Accesible", icon: "wheelchair" },
  ]

  const mockBeach: Beach = {
    code: "575",
    name: "Cala Abierta",
    municipality: 0,
    sea: 0,
    coordinates: [37.543778, -1.147912],
    soilType: "Arena media y gris",
    nudist: false,
    promenade: false,
    anchorageZone: false,
    dogFriendly: false,
    lifeguard: false,
    services: [0, 1, 2],
    activities: [0, 1, 2],
    description: "Una hermosa cala con arena gris.",
    access: "Acceso por sendero.",
    nearby: [],
    orientation: "southeast",
    instagramHashtag: "#CalaAbierta",
  }

  it("returns valid Schema.org structure with required fields", () => {
    const schema = generateBeachSchema(mockBeach, mockMunicipality, mockServices)

    expect(schema["@context"]).toBe("https://schema.org")
    expect(schema["@type"]).toBe("Beach")
    expect(schema.name).toBe("Cala Abierta")
    expect(schema.description).toBe("Una hermosa cala con arena gris.")
    expect(schema.isAccessibleForFree).toBe(true)
  })

  it("generates correct geo coordinates", () => {
    const schema = generateBeachSchema(mockBeach, mockMunicipality, mockServices)

    expect(schema.geo).toEqual({
      "@type": "GeoCoordinates",
      latitude: 37.543778,
      longitude: -1.147912,
    })
  })

  it("generates correct postal address", () => {
    const schema = generateBeachSchema(mockBeach, mockMunicipality, mockServices)

    expect(schema.address).toEqual({
      "@type": "PostalAddress",
      addressLocality: "Cartagena",
      addressRegion: "Murcia",
      addressCountry: "ES",
    })
  })

  it("maps services to amenityFeature names correctly", () => {
    const schema = generateBeachSchema(mockBeach, mockMunicipality, mockServices)

    expect(schema.amenityFeature).toEqual([
      { "@type": "LocationFeatureSpecification", name: "Parking", value: true },
      { "@type": "LocationFeatureSpecification", name: "Shower", value: true },
      { "@type": "LocationFeatureSpecification", name: "Restroom", value: true },
    ])
  })

  it("handles all available service types", () => {
    const beachWithAllServices: Beach = {
      ...mockBeach,
      services: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    }

    const schema = generateBeachSchema(
      beachWithAllServices,
      mockMunicipality,
      mockServices,
    )

    expect(schema.amenityFeature).toEqual([
      { "@type": "LocationFeatureSpecification", name: "Parking", value: true },
      { "@type": "LocationFeatureSpecification", name: "Shower", value: true },
      { "@type": "LocationFeatureSpecification", name: "Restroom", value: true },
      {
        "@type": "LocationFeatureSpecification",
        name: "Foot Wash Station",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Beach Umbrella Rental",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Sunbed Rental",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Restaurant",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "First Aid",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Wheelchair Accessible",
        value: true,
      },
    ])
  })

  it("falls back to description when metaDescription is missing", () => {
    const schema = generateBeachSchema(mockBeach, mockMunicipality, mockServices)

    expect(schema.description).toBe("Una hermosa cala con arena gris.")
  })

  it("uses metaDescription when available", () => {
    const beachWithMetaDescription: Beach = {
      ...mockBeach,
      metaDescription: "Meta description for SEO purposes.",
    }

    const schema = generateBeachSchema(
      beachWithMetaDescription,
      mockMunicipality,
      mockServices,
    )

    expect(schema.description).toBe("Meta description for SEO purposes.")
  })

  it("returns empty amenityFeature array when services array is empty", () => {
    const beachWithoutServices: Beach = {
      ...mockBeach,
      services: [],
    }

    const schema = generateBeachSchema(
      beachWithoutServices,
      mockMunicipality,
      mockServices,
    )

    expect(schema.amenityFeature).toEqual([])
  })

  it("filters out invalid service indices", () => {
    const beachWithInvalidIndices: Beach = {
      ...mockBeach,
      services: [0, 99, 1, 100],
    }

    const schema = generateBeachSchema(
      beachWithInvalidIndices,
      mockMunicipality,
      mockServices,
    )

    expect(schema.amenityFeature).toEqual([
      { "@type": "LocationFeatureSpecification", name: "Parking", value: true },
      { "@type": "LocationFeatureSpecification", name: "Shower", value: true },
    ])
  })

  it("handles negative coordinates correctly", () => {
    const beachWithNegativeCoords: Beach = {
      ...mockBeach,
      coordinates: [-33.8688, 151.2093],
    }

    const schema = generateBeachSchema(
      beachWithNegativeCoords,
      mockMunicipality,
      mockServices,
    )

    expect(schema.geo.latitude).toBe(-33.8688)
    expect(schema.geo.longitude).toBe(151.2093)
  })

  it("preserves beach name exactly as provided", () => {
    const beachWithSpecialChars: Beach = {
      ...mockBeach,
      name: "Playa de Cañón Águilas",
    }

    const schema = generateBeachSchema(
      beachWithSpecialChars,
      mockMunicipality,
      mockServices,
    )

    expect(schema.name).toBe("Playa de Cañón Águilas")
  })
})
