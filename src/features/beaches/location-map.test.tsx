import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { LocationMap } from './location-map'

describe('LocationMap', () => {
  const coords: [number, number] = [37.6894, -0.9812]

  it('renders the section heading', () => {
    render(<LocationMap beachName="Playa Test" coordinates={coords} />)
    expect(screen.getByRole('heading', { name: 'Ubicación' })).toBeTruthy()
  })

  it('renders a loading placeholder while map loads', () => {
    render(<LocationMap beachName="Playa Test" coordinates={coords} />)
    expect(screen.getByText('Cargando mapa...')).toBeTruthy()
  })

  it('renders a Google Maps link with correct coordinates', () => {
    render(<LocationMap beachName="Playa Test" coordinates={coords} />)
    const link = screen.getByText('Ver en Google Maps →')
    expect(link).toBeTruthy()
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.getAttribute('href')).toContain('37.6894')
    expect(link.getAttribute('href')).toContain('-0.9812')
  })

  it('renders the coordinates as text', () => {
    render(<LocationMap beachName="Playa Test" coordinates={coords} />)
    expect(screen.getByText(/37.68940/)).toBeTruthy()
  })
})
