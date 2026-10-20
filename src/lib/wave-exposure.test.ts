import { describe, expect, it } from 'vitest'

import { getWaveExposure } from './wave-exposure'

describe('getWaveExposure', () => {
  it('is exposed when waves come from the direction the beach faces', () => {
    expect(getWaveExposure(135, 135)).toBe('expuesta')
  })

  it('is sheltered when waves come from the land side', () => {
    expect(getWaveExposure(135, 315)).toBe('resguardada')
  })

  it('treats exactly 90 degrees as exposed and just beyond as sheltered', () => {
    expect(getWaveExposure(180, 90)).toBe('expuesta')
    expect(getWaveExposure(180, 89)).toBe('resguardada')
  })

  it('wraps around north', () => {
    expect(getWaveExposure(350, 10)).toBe('expuesta')
    expect(getWaveExposure(10, 350)).toBe('expuesta')
    expect(getWaveExposure(350, 170)).toBe('resguardada')
  })

  it('reads Playa Amarilla (Águilas, facing 200°) sheltered from levante and exposed to poniente', () => {
    const playaAmarilla = 200
    expect(getWaveExposure(playaAmarilla, 90)).toBe('resguardada') // levante (E)
    expect(getWaveExposure(playaAmarilla, 270)).toBe('expuesta') // poniente (W)
  })
})
