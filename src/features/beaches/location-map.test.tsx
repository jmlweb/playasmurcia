import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { LocationMap } from './location-map'

class MockIntersectionObserver {
  observe = vi.fn()
  disconnect = vi.fn()
  unobserve = vi.fn()
}

beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
})

describe('LocationMap', () => {
  const coords: [number, number] = [37.6894, -0.9812]

  it('renders the section heading', () => {
    render(<LocationMap beachName="Playa Test" coordinates={coords} />)
    expect(screen.getByRole('heading', { name: 'Ubicación' })).toBeTruthy()
  })

  it('renders a static map image as placeholder', () => {
    render(<LocationMap beachName="Playa Test" coordinates={coords} />)
    const img = screen.getByAltText('Mapa estático de la ubicación')
    expect(img).toBeTruthy()
    expect(img.getAttribute('src')).toContain('37.6894')
    expect(img.getAttribute('src')).toContain('-0.9812')
  })

  it('renders a directions link with correct coordinates', () => {
    render(<LocationMap beachName="Playa Test" coordinates={coords} />)
    const link = screen.getByRole('link', { name: /Cómo llegar a Playa Test/ })
    expect(link).toBeTruthy()
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.getAttribute('href')).toContain('/maps/dir/')
    expect(link.getAttribute('href')).toContain('37.6894')
    expect(link.getAttribute('href')).toContain('-0.9812')
  })

  it('renders the coordinates as text', () => {
    render(<LocationMap beachName="Playa Test" coordinates={coords} />)
    expect(screen.getByText(/37.68940/)).toBeTruthy()
  })
})
