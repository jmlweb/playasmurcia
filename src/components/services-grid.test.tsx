import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { Service } from '@/types/beach'

import { ServicesGrid } from './services-grid'

const mockServices: Service[] = [
  { id: 'parking', name: 'Parking', icon: '🅿️' },
  { id: 'wc', name: 'Aseos', icon: '🚻' },
  { id: 'lifeguard', name: 'Socorrista', icon: '🏊' },
]

describe('ServicesGrid', () => {
  it('renders nothing when no services are provided', () => {
    const { container } = render(
      <ServicesGrid allServices={mockServices} serviceIndices={[]} />,
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders the services heading', () => {
    render(<ServicesGrid allServices={mockServices} serviceIndices={[0, 1]} />)
    expect(screen.getByRole('heading', { name: 'Servicios' })).toBeTruthy()
  })

  it('renders the correct services by index', () => {
    render(<ServicesGrid allServices={mockServices} serviceIndices={[0, 2]} />)
    expect(screen.getByText('Parking')).toBeTruthy()
    expect(screen.getByText('Socorrista')).toBeTruthy()
    expect(screen.queryByText('Aseos')).toBeNull()
  })

  it('skips out-of-bounds indices gracefully', () => {
    render(<ServicesGrid allServices={mockServices} serviceIndices={[0, 99]} />)
    expect(screen.getByText('Parking')).toBeTruthy()
  })

  it('renders service icons as SVG', () => {
    const { container } = render(
      <ServicesGrid allServices={mockServices} serviceIndices={[0]} />,
    )
    expect(container.querySelector('svg')).toBeTruthy()
  })
})
