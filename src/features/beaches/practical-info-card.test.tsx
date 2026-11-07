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

  it('renders length with meters unit without a disclosure', () => {
    render(<PracticalInfoCard length={750} />)
    expect(screen.getByText('750 m')).toBeTruthy()
    expect(screen.queryByText('Más detalles')).toBeNull()
  })

  it('shows length, shade and orientation without opening anything', () => {
    render(
      <PracticalInfoCard
        length={500}
        naturalShade={false}
        orientation="south"
      />,
    )
    expect(screen.getByText('Longitud')).toBeTruthy()
    expect(screen.getByText('Sombra natural')).toBeTruthy()
    expect(screen.getByText('Orientación')).toBeTruthy()
    expect(document.querySelector('details')).toBeNull()
  })

  it('renders soil type', () => {
    render(<PracticalInfoCard soilType="Arena fina" />)
    expect(screen.getByText('Arena fina')).toBeTruthy()
  })

  it('labels the usual waves apart from today and hides unknown ones', () => {
    render(<PracticalInfoCard length={100} waves="MODERADO" />)
    expect(screen.getByText('Oleaje habitual')).toBeTruthy()
    expect(screen.getByText('Moderado')).toBeTruthy()
  })

  it('stays silent for an undetermined wave value', () => {
    render(<PracticalInfoCard length={100} waves="SIN DETERMINAR" />)
    expect(screen.queryByText('Oleaje habitual')).toBeNull()
  })

  it('groups the decision facts apart from the description of the beach', () => {
    render(<PracticalInfoCard dogFriendly lifeguard length={4531} />)
    expect(screen.getByRole('heading', { name: 'Antes de ir' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'La playa' })).toBeTruthy()
    expect(screen.getByText('Socorrista en temporada')).toBeTruthy()
    expect(screen.getByText('Se admiten perros')).toBeTruthy()
    expect(screen.getByText('4,5 km')).toBeTruthy()
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

  it('renders badges when only badge data is present', () => {
    render(<PracticalInfoCard childSafe waterQuality="excellent" />)
    expect(screen.queryByText('Más detalles')).toBeNull()
  })

  it('renders both badges and details when both types of data exist', () => {
    render(
      <PracticalInfoCard length={500} occupancyLevel="low" waves="Moderado" />,
    )
    expect(screen.getByText('Baja')).toBeTruthy()
    expect(document.querySelector('details')).toBeNull()
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
