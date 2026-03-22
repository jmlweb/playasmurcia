import { describe, expect, it } from "vitest"
import {
  beachToSlug,
  getAllBeaches,
  getBeachByCode,
  getBeachBySlug,
  getMunicipality,
  getService,
  getAllMunicipalities,
  getAllServices,
} from "./db-data"

describe("db-data module", () => {
  describe("getAllBeaches", () => {
    it("returns beaches array with data", async () => {
      const beaches = await getAllBeaches()

      expect(Array.isArray(beaches)).toBe(true)
      expect(beaches.length).toBeGreaterThan(0)
    })

    it("returns beaches with correct structure", async () => {
      const beaches = await getAllBeaches()
      const beach = beaches[0]

      expect(beach).toHaveProperty("code")
      expect(beach).toHaveProperty("name")
      expect(beach).toHaveProperty("municipality")
      expect(beach).toHaveProperty("sea")
      expect(beach).toHaveProperty("coordinates")
      expect(beach).toHaveProperty("soilType")
      expect(beach).toHaveProperty("description")
      expect(beach).toHaveProperty("services")
      expect(beach).toHaveProperty("activities")
      expect(Array.isArray(beach.coordinates)).toBe(true)
      expect(beach.coordinates).toHaveLength(2)
    })
  })

  describe("getBeachByCode", () => {
    it("finds beach by code", async () => {
      const beach = await getBeachByCode("575")

      expect(beach).toBeDefined()
      expect(beach?.code).toBe("575")
    })

    it("returns undefined for non-existent code", async () => {
      const beach = await getBeachByCode("999999")

      expect(beach).toBeUndefined()
    })
  })

  describe("beachToSlug", () => {
    it("converts to lowercase and replaces spaces", () => {
      const slug = beachToSlug({
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
      })

      expect(slug).toBe("playa-grande")
    })

    it("removes accents and diacritics", () => {
      const slug = beachToSlug({
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
      })

      expect(slug).toBe("playa-de-canon-aguilas")
    })
  })

  describe("getBeachBySlug", () => {
    it("finds beach by normalized slug", async () => {
      const beach = await getBeachBySlug("cala-abierta")

      expect(beach).toBeDefined()
      expect(beach?.name).toBe("Cala Abierta")
    })

    it("returns undefined for non-existent slug", async () => {
      const beach = await getBeachBySlug("non-existent-beach")

      expect(beach).toBeUndefined()
    })

    it("slug lookup is consistent with beachToSlug", async () => {
      const beaches = await getAllBeaches()
      const testBeach = beaches[0]
      const slug = beachToSlug(testBeach)
      const foundBeach = await getBeachBySlug(slug)

      expect(foundBeach).toBeDefined()
      expect(foundBeach?.code).toBe(testBeach.code)
    })
  })

  describe("getMunicipality", () => {
    it("returns correct municipality by index", async () => {
      const municipality = await getMunicipality(0)

      expect(municipality).toBeDefined()
      expect(municipality.name).toBe("Cartagena")
      expect(municipality.id).toBe("30016")
    })

    it("returns correct municipality for different indices", async () => {
      const municipality1 = await getMunicipality(1)
      const municipality2 = await getMunicipality(2)

      expect(municipality1.name).toBe("Lorca")
      expect(municipality2.name).toBe("Águilas")
    })

    it("returns municipality with correct structure", async () => {
      const municipality = await getMunicipality(0)

      expect(municipality).toHaveProperty("name")
      expect(municipality).toHaveProperty("id")
      expect(typeof municipality.name).toBe("string")
      expect(typeof municipality.id).toBe("string")
    })
  })

  describe("getService", () => {
    it("returns correct service by index", async () => {
      const service = await getService(0)

      expect(service).toBeDefined()
      expect(service.id).toBe("parking")
      expect(service.name).toBe("Parking")
    })

    it("returns correct service for different indices", async () => {
      const service1 = await getService(1)
      const service2 = await getService(2)

      expect(service1.id).toBe("showers")
      expect(service2.id).toBe("toilets")
    })

    it("returns service with correct structure", async () => {
      const service = await getService(0)

      expect(service).toHaveProperty("id")
      expect(service).toHaveProperty("name")
      expect(service).toHaveProperty("icon")
      expect(typeof service.id).toBe("string")
      expect(typeof service.name).toBe("string")
      expect(typeof service.icon).toBe("string")
    })
  })

  describe("getAllMunicipalities", () => {
    it("returns all municipalities", async () => {
      const municipalities = await getAllMunicipalities()

      expect(Array.isArray(municipalities)).toBe(true)
      expect(municipalities.length).toBeGreaterThan(0)
    })
  })

  describe("getAllServices", () => {
    it("returns all services", async () => {
      const services = await getAllServices()

      expect(Array.isArray(services)).toBe(true)
      expect(services.length).toBeGreaterThan(0)
    })
  })

  describe("data consistency with JSON source", () => {
    it("returns the same number of beaches as JSON", async () => {
      const { beaches: jsonBeaches } = await import("./data")
      const dbBeaches = await getAllBeaches()

      expect(dbBeaches.length).toBe(jsonBeaches.length)
    })

    it("returns the same beach data for a known beach", async () => {
      const { getBeachByCode: jsonGetByCode } = await import("./data")
      const jsonBeach = jsonGetByCode("575")
      const dbBeach = await getBeachByCode("575")

      expect(dbBeach).toBeDefined()
      expect(dbBeach?.name).toBe(jsonBeach?.name)
      expect(dbBeach?.code).toBe(jsonBeach?.code)
      expect(dbBeach?.municipality).toBe(jsonBeach?.municipality)
      expect(dbBeach?.sea).toBe(jsonBeach?.sea)
      expect(dbBeach?.soilType).toBe(jsonBeach?.soilType)
      expect(dbBeach?.nudist).toBe(jsonBeach?.nudist)
      expect(dbBeach?.dogFriendly).toBe(jsonBeach?.dogFriendly)
      expect(dbBeach?.lifeguard).toBe(jsonBeach?.lifeguard)
      expect(dbBeach?.coordinates[0]).toBeCloseTo(jsonBeach!.coordinates[0], 4)
      expect(dbBeach?.coordinates[1]).toBeCloseTo(jsonBeach!.coordinates[1], 4)
    })

    it("municipalities match between JSON and DB", async () => {
      const { municipalities: jsonMunicipalities } = await import("./data")
      const dbMunicipalities = await getAllMunicipalities()

      expect(dbMunicipalities.length).toBe(jsonMunicipalities.length)
      for (let i = 0; i < jsonMunicipalities.length; i++) {
        expect(dbMunicipalities[i].name).toBe(jsonMunicipalities[i].name)
        expect(dbMunicipalities[i].id).toBe(jsonMunicipalities[i].id)
      }
    })

    it("services match between JSON and DB", async () => {
      const { services: jsonServices } = await import("./data")
      const dbServices = await getAllServices()

      expect(dbServices.length).toBe(jsonServices.length)
      for (let i = 0; i < jsonServices.length; i++) {
        expect(dbServices[i].id).toBe(jsonServices[i].id)
        expect(dbServices[i].name).toBe(jsonServices[i].name)
        expect(dbServices[i].icon).toBe(jsonServices[i].icon)
      }
    })
  })
})
