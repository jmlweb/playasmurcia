import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { PracticalInfoCard } from './practical-info-card'

describe('PracticalInfoCard', () => {
  it('renders nothing when no data is provided', () => {
    const { container } = render(<PracticalInfoCard />)
    expect(container.firstChild).toBeNull()
  })

  it('renders the heading when any data is present', () => {
    render(<PracticalInfoCard length={500} />)
    expect(
      screen.getByRole('heading', { name: 'Información práctica' }),
    ).toBeTruthy()
  })

  it('renders length with meters unit inside accordion', () => {
    render(<PracticalInfoCard length={750} />)
    expect(screen.getByText('750 m')).toBeTruthy()
    expect(screen.getByText('Más detalles')).toBeTruthy()
  })

  it('renders soil type', () => {
    render(<PracticalInfoCard soilType="Arena fina" />)
    expect(screen.getByText('Arena fina')).toBeTruthy()
  })

  it('renders waves', () => {
    render(<PracticalInfoCard waves="Moderado" />)
    expect(screen.getByText('Moderado')).toBeTruthy()
  })

  it('renders orientation', () => {
    render(<PracticalInfoCard orientation="Sur" />)
    expect(screen.getByText('Sur')).toBeTruthy()
  })

  it('renders occupancy level badge', () => {
    render(<PracticalInfoCard occupancyLevel="high" />)
    expect(screen.getByText('Alta')).toBeTruthy()
  })

  it('renders best season as translated names', () => {
    render(<PracticalInfoCard bestSeason={['summer', 'spring']} />)
    expect(screen.getByText('Verano, Primavera')).toBeTruthy()
  })

  it('does not render best season when empty array is passed', () => {
    render(<PracticalInfoCard bestSeason={[]} />)
    expect(screen.queryByText('Mejor temporada')).toBeNull()
  })

  it('renders badges without accordion when only badge data is present', () => {
    render(<PracticalInfoCard childSafe waterQuality="excellent" />)
    expect(screen.queryByText('Más detalles')).toBeNull()
  })

  it('renders both badges and accordion when both types of data exist', () => {
    render(
      <PracticalInfoCard length={500} occupancyLevel="low" waves="Moderado" />,
    )
    expect(screen.getByText('Baja')).toBeTruthy()
    expect(screen.getByText('Más detalles')).toBeTruthy()
    expect(screen.getByText('500 m')).toBeTruthy()
  })
  it('cites the official source and season under the water quality', () => {
    render(
      <PracticalInfoCard
        length={500}
        waterQuality="good"
        waterQualitySource={{
          season: 2025,
          samplingPointId: 'ES620M0161611',
          samplingPointName: 'PLAYA MAR DE CRISTAL PM1',
          distanceMeters: 120,
          profileUrl: 'https://nayadeciudadano.sanidad.gob.es/profile/16890',
        }}
      />,
    )
    expect(screen.getByText('Buena')).toBeTruthy()
    expect(screen.getByText(/temporada 2025/)).toBeTruthy()
    const link = screen.getByRole('link', { name: /NÁYADE/ })
    expect(link.getAttribute('href')).toBe(
      'https://nayadeciudadano.sanidad.gob.es/profile/16890',
    )
  })

  it('cites the source without a link when the profile URL is missing', () => {
    render(
      <PracticalInfoCard
        length={500}
        waterQuality="excellent"
        waterQualitySource={{
          season: 2025,
          samplingPointId: 'ES620M0161611',
          samplingPointName: 'PLAYA MAR DE CRISTAL PM1',
          distanceMeters: 120,
        }}
      />,
    )
    expect(screen.getByText(/temporada 2025/)).toBeTruthy()
    expect(screen.queryByRole('link')).toBeNull()
  })

  it('shows no water quality when the beach has no official class', () => {
    render(<PracticalInfoCard length={500} />)
    expect(screen.queryByText('Calidad del agua')).toBeNull()
    expect(screen.queryByText(/temporada/)).toBeNull()
  })
})
