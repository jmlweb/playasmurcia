import { fireEvent, render, screen } from '@testing-library/react'
import { beforeAll, describe, expect, it, vi } from 'vitest'

import type { Beach, Municipality } from '@/types/beach'

import { NearbyCarousel } from './nearby-carousel'

vi.mock('./use-card-weather', () => ({
  useCardWeather: () => ({
    '001': { temp: 19, icon: 'sunny', windSpeed: 8, windDirection: 'N' },
  }),
}))

vi.mock('./use-card-flags', () => ({
  useCardFlags: () => ({ '001': 'ROJA' }),
}))

function makeBeach(overrides: Partial<Beach> = {}): Beach {
  return {
    code: '001',
    name: 'Playa Test',
    municipality: 0,
    sea: 0,
    coordinates: [37.6, -0.9],
    soilType: 'Arena',
    nudist: false,
    promenade: false,
    anchorageZone: false,
    dogFriendly: false,
    lifeguard: false,
    services: [],
    activities: [],
    description: 'Una playa',
    access: 'Por carretera',
    nearby: [],
    orientation: 'Sur',
    instagramHashtag: '#test',
    ...overrides,
    recommendationScore: overrides.recommendationScore ?? 0,
  }
}

const mockMunicipality: Municipality = { name: 'Cartagena', id: '30016' }
const scrollBySpy = vi.fn()

// Same municipality (0) as makeBeach(); 0.009° of latitude is about 1,0 km.
const currentBeach = makeBeach({ code: '000', coordinates: [37.609, -0.9] })

function renderCarousel(items: Parameters<typeof NearbyCarousel>[0]['items']) {
  return render(<NearbyCarousel currentBeach={currentBeach} items={items} />)
}

describe('NearbyCarousel', () => {
  beforeAll(() => {
    // jsdom has no layout, so the track would otherwise never overflow.
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      configurable: true,
      get: () => 800,
    })
    Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
      configurable: true,
      get: () => 2000,
    })
    HTMLElement.prototype.scrollBy = scrollBySpy
  })

  it('renders nothing when no nearby items are provided', () => {
    const { container } = renderCarousel([])
    expect(container.firstChild).toBeNull()
  })

  it('renders the heading', () => {
    renderCarousel([
      {
        beach: makeBeach(),
        municipality: mockMunicipality,
        slug: 'playa-test',
      },
    ])
    expect(
      screen.getByRole('heading', { name: 'Playas cercanas' }),
    ).toBeTruthy()
  })

  it('renders a link for each nearby beach', () => {
    const items = [
      {
        beach: makeBeach({ code: '001', name: 'Playa A' }),
        municipality: mockMunicipality,
        slug: 'playa-a',
      },
      {
        beach: makeBeach({ code: '002', name: 'Playa B' }),
        municipality: mockMunicipality,
        slug: 'playa-b',
      },
    ]
    renderCarousel(items)
    const linkA = screen.getByRole('link', { name: 'Ver playa Playa A' })
    const linkB = screen.getByRole('link', { name: 'Ver playa Playa B' })
    expect(linkA.getAttribute('href')).toBe('/playas/playa-a')
    expect(linkB.getAttribute('href')).toBe('/playas/playa-b')
  })

  it('lists nearby beaches in the order it receives them', () => {
    const names = ['Playa Cercana', 'Playa Media', 'Playa Lejana']
    const items = names.map((name, index) => ({
      beach: makeBeach({ code: String(index), name }),
      municipality: mockMunicipality,
      slug: name,
    }))
    renderCarousel(items)
    const links = screen.getAllByRole('link', { name: /^Ver playa / })
    expect(links.map((link) => link.getAttribute('aria-label'))).toEqual(
      names.map((name) => `Ver playa ${name}`),
    )
  })

  it('renders the beach picture when available', () => {
    const beach = makeBeach({ name: 'Playa Foto', pictures: ['foto.jpg'] })
    renderCarousel([
      { beach, municipality: mockMunicipality, slug: 'playa-foto' },
    ])
    const img = screen.getByRole('img', { name: 'Playa Foto' })
    expect(img.getAttribute('src')).toBe('/pictures/foto.jpg')
  })

  it('renders a placeholder when no pictures are available', () => {
    renderCarousel([
      {
        beach: makeBeach({ name: 'Sin Foto' }),
        municipality: mockMunicipality,
        slug: 'sin-foto',
      },
    ])
    expect(screen.getByText('Sin Foto')).toBeTruthy()
    expect(screen.queryByRole('img', { name: 'Sin Foto' })).toBeNull()
  })

  it('shows only the distance when the municipality matches the current beach', () => {
    renderCarousel([
      {
        beach: makeBeach(),
        municipality: mockMunicipality,
        slug: 'playa-test',
      },
    ])
    expect(screen.getByText('A 1,0 km')).toBeTruthy()
    expect(screen.queryByText(/Cartagena/)).toBeNull()
  })

  it('shows municipality and distance when the municipality differs', () => {
    renderCarousel([
      {
        beach: makeBeach({ municipality: 1 }),
        municipality: { name: 'Mazarrón', id: '30026' },
        slug: 'playa-test',
      },
    ])
    expect(screen.getByText('Mazarrón · a 1,0 km')).toBeTruthy()
  })

  it('shows previous and next controls only when cards overflow the desktop track', () => {
    const fewItems = Array.from({ length: 4 }, (_, index) => ({
      beach: makeBeach({ code: String(index), name: `Playa ${index}` }),
      municipality: mockMunicipality,
      slug: `playa-${index}`,
    }))
    const { unmount } = renderCarousel(fewItems)
    expect(screen.queryByRole('button', { name: 'Anterior' })).toBeNull()
    unmount()

    renderCarousel([
      ...fewItems,
      {
        beach: makeBeach({ code: '4', name: 'Playa 4' }),
        municipality: mockMunicipality,
        slug: 'playa-4',
      },
    ])
    expect(screen.getByRole('button', { name: 'Anterior' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Siguiente' })).toBeTruthy()
  })

  it('scrolls the track forward when Siguiente is pressed', () => {
    const items = Array.from({ length: 5 }, (_, index) => ({
      beach: makeBeach({ code: String(index), name: `Playa ${index}` }),
      municipality: mockMunicipality,
      slug: `playa-${index}`,
    }))
    renderCarousel(items)
    const next = screen.getByRole('button', { name: 'Siguiente' })
    fireEvent.click(next)
    expect(scrollBySpy).toHaveBeenCalledWith(
      expect.objectContaining({ left: 800, behavior: 'smooth' }),
    )
  })

  it('shows live conditions so the visitor can compare', () => {
    renderCarousel([
      {
        beach: makeBeach(),
        municipality: mockMunicipality,
        slug: 'playa-test',
      },
    ])
    expect(screen.getByText('19°')).toBeTruthy()
    expect(screen.getByText('Bandera roja')).toBeTruthy()
  })
})
