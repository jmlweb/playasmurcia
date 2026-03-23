import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { ServicesGrid } from "./services-grid"
import type { Service } from "@/types/beach"

const mockServices: Array<Service> = [
  { id: "parking", name: "Parking", icon: "🅿️" },
  { id: "wc", name: "Aseos", icon: "🚻" },
  { id: "lifeguard", name: "Socorrista", icon: "🏊" },
]

describe("ServicesGrid", () => {
  it("renders nothing when no services are provided", () => {
    const { container } = render(
      <ServicesGrid serviceIndices={[]} allServices={mockServices} />,
    )
    expect(container.firstChild).toBeNull()
  })

  it("renders the services heading", () => {
    render(<ServicesGrid serviceIndices={[0, 1]} allServices={mockServices} />)
    expect(screen.getByRole("heading", { name: "Servicios" })).toBeTruthy()
  })

  it("renders the correct services by index", () => {
    render(<ServicesGrid serviceIndices={[0, 2]} allServices={mockServices} />)
    expect(screen.getByText("Parking")).toBeTruthy()
    expect(screen.getByText("Socorrista")).toBeTruthy()
    expect(screen.queryByText("Aseos")).toBeNull()
  })

  it("skips out-of-bounds indices gracefully", () => {
    render(<ServicesGrid serviceIndices={[0, 99]} allServices={mockServices} />)
    expect(screen.getByText("Parking")).toBeTruthy()
  })

  it("renders service icons", () => {
    render(<ServicesGrid serviceIndices={[0]} allServices={mockServices} />)
    expect(screen.getByText("🅿️")).toBeTruthy()
  })
})
