import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { PracticalInfoCard } from "./practical-info-card"

describe("PracticalInfoCard", () => {
  it("renders nothing when no data is provided", () => {
    const { container } = render(<PracticalInfoCard />)
    expect(container.firstChild).toBeNull()
  })

  it("renders the heading when any data is present", () => {
    render(<PracticalInfoCard length={500} />)
    expect(screen.getByRole("heading", { name: "Información práctica" })).toBeTruthy()
  })

  it("renders length with meters unit", () => {
    render(<PracticalInfoCard length={750} />)
    expect(screen.getByText("750 m")).toBeTruthy()
  })

  it("renders soil type", () => {
    render(<PracticalInfoCard soilType="Arena fina" />)
    expect(screen.getByText("Arena fina")).toBeTruthy()
  })

  it("renders waves", () => {
    render(<PracticalInfoCard waves="Moderado" />)
    expect(screen.getByText("Moderado")).toBeTruthy()
  })

  it("renders orientation", () => {
    render(<PracticalInfoCard orientation="Sur" />)
    expect(screen.getByText("Sur")).toBeTruthy()
  })

  it("renders occupancy level badge", () => {
    render(<PracticalInfoCard occupancyLevel="high" />)
    expect(screen.getByText("Alta")).toBeTruthy()
  })

  it("renders best season as translated names", () => {
    render(<PracticalInfoCard bestSeason={["summer", "spring"]} />)
    expect(screen.getByText("Verano, Primavera")).toBeTruthy()
  })

  it("does not render best season when empty array is passed", () => {
    render(<PracticalInfoCard bestSeason={[]} />)
    expect(screen.queryByText("Mejor temporada")).toBeNull()
  })
})
