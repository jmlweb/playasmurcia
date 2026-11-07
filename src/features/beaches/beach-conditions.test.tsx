import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { BeachFlag } from '@/lib/beach-status-112'
import type { CardWeather } from '@/lib/open-meteo'

import { BeachConditions } from './beach-conditions'
import { useBeachWaveHeight } from './use-beach-waves'
import { useCardFlags } from './use-card-flags'
import { useCardWeather } from './use-card-weather'

vi.mock('./use-beach-waves', () => ({ useBeachWaveHeight: vi.fn() }))
vi.mock('./use-card-flags', () => ({ useCardFlags: vi.fn() }))
vi.mock('./use-card-weather', () => ({ useCardWeather: vi.fn() }))

const code = 'CT-1'

const mockConditions = ({
  weather = {},
  flags = {},
  waveHeight,
}: {
  weather?: Record<string, CardWeather>
  flags?: Record<string, BeachFlag>
  waveHeight?: number
}) => {
  vi.mocked(useCardWeather).mockReturnValue(weather)
  vi.mocked(useCardFlags).mockReturnValue(flags)
  vi.mocked(useBeachWaveHeight).mockReturnValue(waveHeight)
}

const renderConditions = (hasOpenSeaWaves = true) =>
  render(<BeachConditions beachCode={code} hasOpenSeaWaves={hasOpenSeaWaves} />)

describe('BeachConditions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows every available fact with its sources', () => {
    mockConditions({
      weather: {
        [code]: {
          temp: 19,
          icon: 'sunny',
          windSpeed: 12,
          windDirection: 'NE',
        },
      },
      flags: { [code]: 'VERDE' },
      waveHeight: 0.42,
    })
    renderConditions()

    expect(screen.getByText('19°')).toBeTruthy()
    expect(screen.getByText('Viento 12 km/h Noreste')).toBeTruthy()
    expect(screen.getByText('Oleaje hoy 0,4 m')).toBeTruthy()
    expect(screen.getByText('Bandera verde')).toBeTruthy()
    expect(
      screen.getByText('Datos recientes: Open-Meteo y 112 Región de Murcia'),
    ).toBeTruthy()
  })

  it('shows nothing when no source has data', () => {
    mockConditions({})
    renderConditions()

    expect(screen.queryByRole('list')).toBeNull()
    expect(screen.queryByText(/Datos recientes/)).toBeNull()
  })

  it('names only the source that answered', () => {
    mockConditions({ flags: { [code]: 'ROJA' } })
    renderConditions()

    expect(screen.getByText('Bandera roja')).toBeTruthy()
    expect(
      screen.getByText('Datos recientes: 112 Región de Murcia'),
    ).toBeTruthy()
  })

  it('does not request waves for the Mar Menor', () => {
    mockConditions({})
    renderConditions(false)

    expect(useBeachWaveHeight).toHaveBeenCalledWith(code, false)
  })
})
