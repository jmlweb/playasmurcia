import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const serverFn = vi.hoisted(() => vi.fn())

vi.mock('@tanstack/react-start', () => ({
  createServerFn: () => ({
    validator: () => ({ handler: () => serverFn }),
  }),
}))

vi.mock('./use-beach-waves', () => ({
  fetchMarineWeatherFn: () =>
    Promise.resolve({
      currentTemp: 22,
      waveHeight: 0.3,
      waveDirection: 'NO',
      waveDirectionDegrees: 315,
    }),
}))

const { WeatherWidget } = await import('./weather-widget')

const forecast = {
  source: 'open-meteo',
  days: [
    {
      fecha: Date.parse('2026-11-07T12:00:00Z'),
      skyDescription: 'Cubierto',
      skyIcon: 'cloudy',
      tMaxima: 21,
      tMinima: 17,
      windSpeed: 4,
      windDirection: 'NO',
      uvIndex: 2,
    },
  ],
}

describe('WeatherWidget', () => {
  beforeEach(() => {
    serverFn.mockReset()
  })

  it('spells out directions and labels live waves on the open sea', async () => {
    serverFn.mockResolvedValue(forecast)
    render(
      <WeatherWidget
        hasOpenSeaWaves
        beachCode="1"
        hasAemetForecast={false}
        shoreBearing={315}
      />,
    )
    expect(await screen.findByText(/Oleaje hoy/)).toBeTruthy()
    expect(screen.getByText(/4 km\/h Noroeste/)).toBeTruthy()
    expect(screen.getByText(/entra de frente/)).toBeTruthy()
  })

  it('shows no wave data for the Mar Menor', async () => {
    serverFn.mockResolvedValue(forecast)
    render(
      <WeatherWidget
        beachCode="1"
        hasAemetForecast={false}
        hasOpenSeaWaves={false}
      />,
    )
    expect(await screen.findByText('Agua 22°')).toBeTruthy()
    expect(screen.queryByText(/Oleaje/)).toBeNull()
  })

  it('offers a retry when the forecast fails and recovers', async () => {
    serverFn.mockResolvedValueOnce(null)
    render(
      <WeatherWidget hasOpenSeaWaves beachCode="1" hasAemetForecast={false} />,
    )
    const retry = await screen.findByRole('button', { name: 'Reintentar' })
    serverFn.mockResolvedValue(forecast)
    fireEvent.click(retry)
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Previsión' })).toBeTruthy()
      expect(screen.queryByRole('button', { name: 'Reintentar' })).toBeNull()
    })
  })
})
