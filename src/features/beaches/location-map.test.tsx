import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { markerIcon } from './leaflet-map'
import { LocationMap } from './location-map'
import { MAPBOX_STYLE } from './map-style'

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

  it('renders one Cómo llegar heading that labels the section', () => {
    render(<LocationMap beachName="Playa Test" coordinates={coords} />)
    expect(
      screen.getAllByRole('heading', { name: 'Cómo llegar' }),
    ).toHaveLength(1)
    expect(screen.getByRole('region', { name: 'Cómo llegar' })).toBeTruthy()
  })

  it('renders the access text above the map when present', () => {
    render(
      <LocationMap
        access="Por la **carretera del faro**."
        beachName="Playa Test"
        coordinates={coords}
      />,
    )
    expect(screen.getByText('carretera del faro')).toBeTruthy()
    expect(screen.getByAltText('Mapa de Playa Test')).toBeTruthy()
  })

  it('still renders the map without access text', () => {
    render(<LocationMap beachName="Playa Test" coordinates={coords} />)
    expect(screen.getByAltText('Mapa de Playa Test')).toBeTruthy()
    expect(
      screen.getAllByRole('link', { name: /Cómo llegar a Playa Test/ }),
    ).toHaveLength(1)
  })

  it('renders a static map image as placeholder', () => {
    render(<LocationMap beachName="Playa Test" coordinates={coords} />)
    const img = screen.getByAltText('Mapa de Playa Test')
    expect(img).toBeTruthy()
    expect(img.getAttribute('src')).toContain('37.6894')
    expect(img.getAttribute('src')).toContain('-0.9812')
    expect(img.getAttribute('src')).toContain(`/${MAPBOX_STYLE}/`)
  })

  it('draws the same pin as the live map over the static image', () => {
    const { container } = render(
      <LocationMap beachName="Playa Test" coordinates={coords} />,
    )
    const img = screen.getByAltText('Mapa de Playa Test')
    expect(img.getAttribute('src')).not.toContain('pin-')
    expect(
      container.querySelector(`img[src="${markerIcon.options.iconUrl}"]`),
    ).toBeTruthy()
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
