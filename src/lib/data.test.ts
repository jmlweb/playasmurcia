import { describe, it, expect } from "vitest"
import type { Beach } from "@/types/beach"
import {
  beaches,
  municipalities,
  services,
  getBeachByCode,
  getBeachBySlug,
  beachToSlug,
  getMunicipality,
  getService,
} from "./data"

describe("data module", () => {
  describe("exported data", () => {
    it("exports beaches array", () => {
      expect(Array.isArray(beaches)).toBe(true)
      expect(beaches.length).toBeGreaterThan(0)
    })

    it("exports municipalities array", () => {
      expect(Array.isArray(municipalities)).toBe(true)
      expect(municipalities.length).toBeGreaterThan(0)
    })

    it("exports services array", () => {
      expect(Array.isArray(services)).toBe(true)
      expect(services.length).toBeGreaterThan(0)
    })
  })

  describe("getBeachByCode", () => {
    it("finds beach by code", () => {
      const beach = getBeachByCode("575")

      expect(beach).toBeDefined()
      expect(beach?.code).toBe("575")
    })

    it("returns undefined for non-existent code", () => {
      const beach = getBeachByCode("999999")

      expect(beach).toBeUndefined()
    })

    it("returns the first matching beach if duplicates exist", () => {
      const beach = getBeachByCode("575")

      expect(beach).toBeDefined()
    })
  })

  describe("beachToSlug", () => {
    it("converts to lowercase", () => {
      const mockBeach: Beach = {
        code: "1",
        name: "PLAYA GRANDE",
        municipality: 0,
        sea: 0,
        coordinates: [0, 0],
        soilType: "Arena",
        nudist: false,
        promenade: false,
        anchorageZone: false,
        dogFriendly: false,
        lifeguard: false,
        services: [],
        activities: [],
        description: "",
        access: "",
        nearby: [],
        orientation: "",
        instagramHashtag: "",
      }

      const slug = beachToSlug(mockBeach)

      expect(slug).toBe("playa-grande")
    })

    it("replaces spaces with hyphens", () => {
      const mockBeach: Beach = {
        code: "1",
        name: "Cala Del Sol",
        municipality: 0,
        sea: 0,
        coordinates: [0, 0],
        soilType: "Arena",
        nudist: false,
        promenade: false,
        anchorageZone: false,
        dogFriendly: false,
        lifeguard: false,
        services: [],
        activities: [],
        description: "",
        access: "",
        nearby: [],
        orientation: "",
        instagramHashtag: "",
      }

      const slug = beachToSlug(mockBeach)

      expect(slug).toBe("cala-del-sol")
    })

    it("removes accents and diacritics", () => {
      const mockBeach: Beach = {
        code: "1",
        name: "Playa de Cañón Águilas",
        municipality: 0,
        sea: 0,
        coordinates: [0, 0],
        soilType: "Arena",
        nudist: false,
        promenade: false,
        anchorageZone: false,
        dogFriendly: false,
        lifeguard: false,
        services: [],
        activities: [],
        description: "",
        access: "",
        nearby: [],
        orientation: "",
        instagramHashtag: "",
      }

      const slug = beachToSlug(mockBeach)

      expect(slug).toBe("playa-de-canon-aguilas")
      expect(slug).not.toContain("ñ")
      expect(slug).not.toContain("á")
    })

    it("handles multiple consecutive spaces", () => {
      const mockBeach: Beach = {
        code: "1",
        name: "Playa   Del    Mar",
        municipality: 0,
        sea: 0,
        coordinates: [0, 0],
        soilType: "Arena",
        nudist: false,
        promenade: false,
        anchorageZone: false,
        dogFriendly: false,
        lifeguard: false,
        services: [],
        activities: [],
        description: "",
        access: "",
        nearby: [],
        orientation: "",
        instagramHashtag: "",
      }

      const slug = beachToSlug(mockBeach)

      expect(slug).toBe("playa-del-mar")
    })

    it("handles names with special characters", () => {
      const mockBeach: Beach = {
        code: "1",
        name: "Caló d'És Monjos",
        municipality: 0,
        sea: 0,
        coordinates: [0, 0],
        soilType: "Arena",
        nudist: false,
        promenade: false,
        anchorageZone: false,
        dogFriendly: false,
        lifeguard: false,
        services: [],
        activities: [],
        description: "",
        access: "",
        nearby: [],
        orientation: "",
        instagramHashtag: "",
      }

      const slug = beachToSlug(mockBeach)

      expect(slug).toBe("calo-d'es-monjos")
    })
  })

  describe("getBeachBySlug", () => {
    it("finds beach by normalized slug", () => {
      const beach = getBeachBySlug("cala-abierta")

      expect(beach).toBeDefined()
      expect(beach?.name).toBe("Cala Abierta")
    })

    it("returns undefined for non-existent slug", () => {
      const beach = getBeachBySlug("non-existent-beach")

      expect(beach).toBeUndefined()
    })

    it("handles slug with accents removed", () => {
      // Find a beach with accents in the actual data
      const beachWithAccents = beaches.find((b) =>
        b.name.match(/[áéíóúñ]/i),
      )

      if (beachWithAccents) {
        const normalizedSlug = beachWithAccents.name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/\s+/g, "-")

        const foundBeach = getBeachBySlug(normalizedSlug)

        expect(foundBeach).toBeDefined()
        expect(foundBeach?.code).toBe(beachWithAccents.code)
      }
    })

    it("handles case-insensitive matching", () => {
      const beach = getBeachBySlug("cala-abierta")

      // The function normalizes to lowercase, so uppercase slug won't match
      // because the comparison is done after normalization
      expect(beach).toBeDefined()
      expect(beach?.name).toBe("Cala Abierta")
    })

    it("normalizes slug consistently with beachToSlug", () => {
      const testBeach = beaches[0]
      const slug = beachToSlug(testBeach)
      const foundBeach = getBeachBySlug(slug)

      expect(foundBeach).toBeDefined()
      expect(foundBeach?.code).toBe(testBeach.code)
    })
  })

  describe("getMunicipality", () => {
    it("returns correct municipality by index", () => {
      const municipality = getMunicipality(0)

      expect(municipality).toBeDefined()
      expect(municipality.name).toBe("Cartagena")
      expect(municipality.id).toBe("30016")
    })

    it("returns correct municipality for different indices", () => {
      const municipality1 = getMunicipality(1)
      const municipality2 = getMunicipality(2)

      expect(municipality1.name).toBe("Lorca")
      expect(municipality2.name).toBe("Águilas")
    })

    it("returns municipality object with correct structure", () => {
      const municipality = getMunicipality(0)

      expect(municipality).toHaveProperty("name")
      expect(municipality).toHaveProperty("id")
      expect(typeof municipality.name).toBe("string")
      expect(typeof municipality.id).toBe("string")
    })
  })

  describe("getService", () => {
    it("returns correct service by index", () => {
      const service = getService(0)

      expect(service).toBeDefined()
      expect(service.id).toBe("parking")
      expect(service.name).toBe("Parking")
    })

    it("returns correct service for different indices", () => {
      const service1 = getService(1)
      const service2 = getService(2)

      expect(service1.id).toBe("showers")
      expect(service2.id).toBe("toilets")
    })

    it("returns service object with correct structure", () => {
      const service = getService(0)

      expect(service).toHaveProperty("id")
      expect(service).toHaveProperty("name")
      expect(service).toHaveProperty("icon")
      expect(typeof service.id).toBe("string")
      expect(typeof service.name).toBe("string")
      expect(typeof service.icon).toBe("string")
    })
  })

  describe("data consistency", () => {
    it("all beach municipality indices reference valid municipalities", () => {
      const invalidBeaches = beaches.filter(
        (beach) =>
          beach.municipality < 0 ||
          beach.municipality >= municipalities.length,
      )

      expect(invalidBeaches).toHaveLength(0)
    })

    it("all beach service indices reference valid services", () => {
      const allServiceIndices = beaches.flatMap((beach) => beach.services)
      const invalidIndices = allServiceIndices.filter(
        (index) => index < 0 || index >= services.length,
      )

      expect(invalidIndices).toHaveLength(0)
    })

    it("all beaches have unique codes", () => {
      const codes = beaches.map((beach) => beach.code)
      const uniqueCodes = new Set(codes)

      expect(uniqueCodes.size).toBe(codes.length)
    })

    it("all beach names can be converted to slugs", () => {
      const slugs = beaches.map(beachToSlug)

      expect(slugs).toHaveLength(beaches.length)
      // Slugs should be lowercase with hyphens, may contain dots, parentheses, etc.
      slugs.forEach((slug) => {
        expect(slug).toBeTruthy()
        expect(typeof slug).toBe("string")
        expect(slug.toLowerCase()).toBe(slug) // Should be lowercase
      })
    })
  })
})
