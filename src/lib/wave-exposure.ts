export type WaveExposure = 'expuesta' | 'resguardada'

// Waves arriving from within this angle of the direction the beach faces hit it
const EXPOSED_HALF_ANGLE_DEGREES = 90

function angularDifference(a: number, b: number): number {
  const diff = Math.abs(a - b) % 360
  return diff > 180 ? 360 - diff : diff
}

/**
 * @param shoreBearing Compass degrees the beach faces seaward.
 * @param waveDirection Compass degrees the waves come from (Open-Meteo convention).
 */
export function getWaveExposure(
  shoreBearing: number,
  waveDirection: number,
): WaveExposure {
  return angularDifference(shoreBearing, waveDirection) <=
    EXPOSED_HALF_ANGLE_DEGREES
    ? 'expuesta'
    : 'resguardada'
}
