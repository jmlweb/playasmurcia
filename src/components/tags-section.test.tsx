import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { TagsSection } from "./tags-section"
import type { Tag } from "@/types/beach"

const mockTags: Array<Tag> = [
  { id: "family", name: "Familiar" },
  { id: "quiet", name: "Tranquila" },
  { id: "nudist", name: "Nudista" },
]

describe("TagsSection", () => {
  it("renders nothing when no tags are provided", () => {
    const { container } = render(<TagsSection tagIndices={[]} allTags={mockTags} />)
    expect(container.firstChild).toBeNull()
  })

  it("renders the correct tags by index", () => {
    render(<TagsSection tagIndices={[0, 2]} allTags={mockTags} />)
    expect(screen.getByText("Familiar")).toBeTruthy()
    expect(screen.getByText("Nudista")).toBeTruthy()
    expect(screen.queryByText("Tranquila")).toBeNull()
  })

  it("skips out-of-bounds indices gracefully", () => {
    render(<TagsSection tagIndices={[0, 99]} allTags={mockTags} />)
    expect(screen.getByText("Familiar")).toBeTruthy()
  })

  it("renders all tags when all indices are provided", () => {
    render(<TagsSection tagIndices={[0, 1, 2]} allTags={mockTags} />)
    expect(screen.getByText("Familiar")).toBeTruthy()
    expect(screen.getByText("Tranquila")).toBeTruthy()
    expect(screen.getByText("Nudista")).toBeTruthy()
  })
})
