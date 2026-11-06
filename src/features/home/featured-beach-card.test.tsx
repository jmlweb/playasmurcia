import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type { BeachFlag } from '@/lib/beach-status-112'
import type { Beach, Municipality } from '@/types/beach'

import { FeaturedBeachCard } from './featured-beach-card'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
}))

const beach = {
  code: '645',
  name: 'Playa de El Rincón',
  length: 410,
  soilType: 'Arena gruesa',
  pictures: ['rincon_g.jpg'],
} as Beach

const municipality: Municipality = { id: '30026', name: 'Mazarrón' }

const renderCard = (
  props: Partial<React.ComponentProps<typeof FeaturedBeachCard>> = {},
) =>
  render(
    <FeaturedBeachCard
      beach={beach}
      municipality={municipality}
      slug="playa-de-el-rincon"
      {...props}
    />,
  )

describe('FeaturedBeachCard', () => {
  it('shows the fact line', () => {
    renderCard()

    expect(screen.getByText('410 m · Arena gruesa')).toBeTruthy()
  })

  it('renders live pills when data arrives', () => {
    renderCard({
      weather: { temp: 19, icon: 'sunny', windSpeed: 8, windDirection: 'E' },
      flag: 'VERDE',
    })

    expect(screen.getByText('19°')).toBeTruthy()
    expect(screen.getByText('8 km/h E')).toBeTruthy()
    expect(screen.getByText('Bandera verde')).toBeTruthy()
  })

  it('stays silent without live data', () => {
    renderCard()

    expect(screen.queryByText(/°/)).toBeNull()
    expect(screen.queryByText(/Bandera/)).toBeNull()
  })

  it.each<BeachFlag>(['ROJA', 'PLAYA CERRADA'])(
    'drops the label on %s',
    (flag) => {
      renderCard({ flag })

      expect(screen.queryByText('Imprescindible')).toBeNull()
    },
  )

  it.each<BeachFlag | undefined>(['VERDE', 'AMARILLA', undefined])(
    'keeps the label on %s',
    (flag) => {
      renderCard(flag ? { flag } : {})

      expect(screen.getByText('Imprescindible')).toBeTruthy()
    },
  )

  it('omits the fact line when the beach has no facts', () => {
    const { container } = renderCard({
      beach: {
        ...beach,
        length: undefined,
        soilType: undefined,
      } as unknown as Beach,
    })

    expect(container.textContent).not.toContain('undefined')
    expect(container.textContent).not.toContain(' · ')
  })
})
