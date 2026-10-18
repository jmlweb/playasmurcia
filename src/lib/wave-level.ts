export type WaveLevel = 'bajo' | 'moderado' | 'alto'

/**
 * Significant wave height in metres mapped to a bather-friendly level.
 * Thresholds follow the Douglas sea scale: calm/smooth below 0.5 m,
 * slight up to 1.25 m, moderate or rougher above.
 */
export function getWaveLevel(waveHeight: number): WaveLevel {
  if (waveHeight < 0.5) return 'bajo'
  if (waveHeight < 1.25) return 'moderado'
  return 'alto'
}

/** Formats metres with one decimal and a Spanish decimal comma: 0.4 -> "0,4". */
export function formatWaveHeight(waveHeight: number): string {
  return (Math.round(waveHeight * 10) / 10).toFixed(1).replace('.', ',')
}
