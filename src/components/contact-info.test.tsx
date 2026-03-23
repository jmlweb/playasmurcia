import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { ContactInfo } from "./contact-info"

describe("ContactInfo", () => {
  it("renders nothing when no contact info is provided", () => {
    const { container } = render(<ContactInfo />)
    expect(container.firstChild).toBeNull()
  })

  it("renders the heading when any info is present", () => {
    render(<ContactInfo phone="968 000 000" />)
    expect(screen.getByRole("heading", { name: "Contacto" })).toBeTruthy()
  })

  it("renders a tel link for phone", () => {
    render(<ContactInfo phone="968 123 456" />)
    const link = screen.getByRole("link", { name: "968 123 456" })
    expect(link.getAttribute("href")).toBe("tel:968 123 456")
  })

  it("renders a mailto link for email", () => {
    render(<ContactInfo email="info@playa.es" />)
    const link = screen.getByRole("link", { name: "info@playa.es" })
    expect(link.getAttribute("href")).toBe("mailto:info@playa.es")
  })

  it("renders a link to the real URL", () => {
    render(<ContactInfo realUrl="https://example.com" />)
    const link = screen.getByRole("link", { name: "Sitio web oficial" })
    expect(link.getAttribute("href")).toBe("https://example.com")
    expect(link.getAttribute("target")).toBe("_blank")
  })

  it("renders an Instagram hashtag link", () => {
    render(<ContactInfo instagramHashtag="#playamurcia" />)
    const link = screen.getByRole("link", { name: "#playamurcia" })
    expect(link.getAttribute("href")).toBe(
      "https://www.instagram.com/explore/tags/playamurcia/",
    )
  })

  it("renders all contact fields together", () => {
    render(
      <ContactInfo
        phone="968 000 000"
        email="info@playa.es"
        realUrl="https://example.com"
        instagramHashtag="#test"
      />,
    )
    expect(screen.getByRole("link", { name: "968 000 000" })).toBeTruthy()
    expect(screen.getByRole("link", { name: "info@playa.es" })).toBeTruthy()
    expect(screen.getByRole("link", { name: "Sitio web oficial" })).toBeTruthy()
    expect(screen.getByRole("link", { name: "#test" })).toBeTruthy()
  })
})
