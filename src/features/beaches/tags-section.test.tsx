import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { Tag } from '@/types/beach'

import { TagsSection } from './tags-section'

const mockTags: Tag[] = [
  { id: 'family', name: 'Familiar' },
  { id: 'quiet', name: 'Tranquila' },
  { id: 'nudist', name: 'Nudista' },
]

describe('TagsSection', () => {
  it('renders nothing when no tags are provided', () => {
    const { container } = render(
      <TagsSection allTags={mockTags} tagIndices={[]} />,
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders the correct tags by index', () => {
    render(<TagsSection allTags={mockTags} tagIndices={[0, 2]} />)
    expect(screen.getByText('Familiar')).toBeTruthy()
    expect(screen.getByText('Nudista')).toBeTruthy()
    expect(screen.queryByText('Tranquila')).toBeNull()
  })

  it('skips out-of-bounds indices gracefully', () => {
    render(<TagsSection allTags={mockTags} tagIndices={[0, 99]} />)
    expect(screen.getByText('Familiar')).toBeTruthy()
  })

  it('renders all tags when all indices are provided', () => {
    render(<TagsSection allTags={mockTags} tagIndices={[0, 1, 2]} />)
    expect(screen.getByText('Familiar')).toBeTruthy()
    expect(screen.getByText('Tranquila')).toBeTruthy()
    expect(screen.getByText('Nudista')).toBeTruthy()
  })
})
