import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { CollectionCard } from './collection-card'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, ...props }: { children: React.ReactNode }) => (
    <a {...props}>{children}</a>
  ),
}))

const baseProps = {
  slug: 'bandera-azul',
  title: 'Bandera Azul',
  description: 'Playas con bandera azul',
  beachCount: 1,
}

describe('CollectionCard', () => {
  it('shows title, description and singular count', () => {
    render(<CollectionCard {...baseProps} />)

    expect(screen.getByText('Bandera Azul')).toBeTruthy()
    expect(screen.getByText('Playas con bandera azul')).toBeTruthy()
    expect(screen.getByText(/playa$/)).toBeTruthy()
  })

  it('renders a cover image only when a picture is given', () => {
    const { container, rerender } = render(<CollectionCard {...baseProps} />)
    expect(container.querySelector('img')).toBeNull()

    rerender(<CollectionCard {...baseProps} coverPicture="foto.jpg" />)
    expect(container.querySelector('img')).not.toBeNull()
  })
})
