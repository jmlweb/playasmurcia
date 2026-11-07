import { describe, expect, it } from 'vitest'

import { appendLaterDays, mergeForecastDays } from './forecast-days'

const day = (fecha: number, source: string) => ({ fecha, source })

describe('appendLaterDays', () => {
  it('adds only the days after the last primary day', () => {
    const result = appendLaterDays(
      [day(1, 'aemet'), day(2, 'aemet')],
      [day(1, 'om'), day(2, 'om'), day(3, 'om'), day(4, 'om')],
    )
    expect(result).toEqual([
      day(1, 'aemet'),
      day(2, 'aemet'),
      day(3, 'om'),
      day(4, 'om'),
    ])
  })

  it('keeps the primary days when the fallback adds nothing', () => {
    expect(appendLaterDays([day(1, 'aemet')], [day(1, 'om')])).toEqual([
      day(1, 'aemet'),
    ])
  })

  it('keeps the primary days when the fallback is empty', () => {
    expect(appendLaterDays([day(1, 'aemet')], [])).toEqual([day(1, 'aemet')])
  })
})

describe('mergeForecastDays', () => {
  const aemet = {
    fecha: 1,
    skyDescription: 'Nuboso',
    skyIcon: '',
    tMaxima: 23,
    tMinima: undefined,
    wavesDescription: 'Débil',
  }
  const openMeteo = {
    fecha: 1,
    skyDescription: 'Cubierto',
    skyIcon: 'cloudy',
    tMaxima: 22,
    tMinima: 16,
    windSpeed: 12,
    windDirection: 'NO',
    precipitationProbability: 24,
  }

  it('keeps what AEMET publishes and fills what it lacks', () => {
    expect(mergeForecastDays([aemet], [openMeteo])).toEqual([
      {
        fecha: 1,
        skyDescription: 'Nuboso',
        skyIcon: '',
        tMaxima: 23,
        tMinima: 16,
        windSpeed: 12,
        windDirection: 'NO',
        precipitationProbability: 24,
        wavesDescription: 'Débil',
      },
    ])
  })

  it('uses the Open-Meteo sky when AEMET has none', () => {
    const [day] = mergeForecastDays(
      [{ ...aemet, skyDescription: '' }],
      [openMeteo],
    )
    expect(day.skyDescription).toBe('Cubierto')
    expect(day.skyIcon).toBe('cloudy')
  })

  it('appends the days AEMET does not cover', () => {
    const later = { ...openMeteo, fecha: 2 }
    expect(
      mergeForecastDays([aemet], [openMeteo, later]).map((d) => d.fecha),
    ).toEqual([1, 2])
  })
})
