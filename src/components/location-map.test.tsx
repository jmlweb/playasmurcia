import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { LocationMap } from "./location-map"

describe("LocationMap", () => {
  const coords: [number, number] = [37.6894, -0.9812]

  it("renders the section heading", () => {
    render(<LocationMap coordinates={coords} beachName="Playa Test" />)
    expect(screen.getByRole("heading", { name: "Ubicación" })).toBeTruthy()
  })

  it("renders the map image with correct alt text", () => {
    render(<LocationMap coordinates={coords} beachName="Playa Test" />)
    const img = screen.getByRole("img", { name: "Mapa de ubicación de Playa Test" })
    expect(img).toBeTruthy()
  })

  it("renders a Google Maps link with correct coordinates", () => {
    render(<LocationMap coordinates={coords} beachName="Playa Test" />)
    const links = screen.getAllByRole("link")
    const mapsLink = links.find((l) =>
      l.getAttribute("href")?.includes("google.com/maps"),
    )
    expect(mapsLink).toBeTruthy()
    expect(mapsLink?.getAttribute("target")).toBe("_blank")
    expect(mapsLink?.getAttribute("href")).toContain("37.6894")
    expect(mapsLink?.getAttribute("href")).toContain("-0.9812")
  })

  it("renders the coordinates as text", () => {
    render(<LocationMap coordinates={coords} beachName="Playa Test" />)
    expect(screen.getByText(/37.68940/)).toBeTruthy()
  })
})
