/**
 * Computes a recommendation score (0-1) from internal beach data.
 *
 * Weights: services 30%, length 15%, photo quality 10%,
 * accessibility 15%, blue flag 15%, child-safe 10%, natural shade 5%
 */
export function computeRecommendationScore(beach: {
  services: number[]
  length: number | null
  pictureQualityScore: number | null
  accessDifficulty: string | null
  certifications: string | null
  childSafe: boolean | null
  naturalShade: boolean | null
}): number {
  // Services: 0-1 normalized (cap at 8 services for max score)
  const servicesScore = Math.min(beach.services.length / 8, 1)

  // Length: 0-1 normalized (cap at 1000m for max score)
  const lengthScore =
    beach.length != null ? Math.min(beach.length / 1000, 1) : 0.3

  // Photo quality: 0-1 from 0-3 score
  const photoScore = (beach.pictureQualityScore ?? 0) / 3

  // Accessibility: easy=1, moderate=0.6, hard=0.2, unknown=0.5
  const accessMap: Record<string, number> = {
    easy: 1,
    moderate: 0.6,
    hard: 0.2,
  }
  const accessScore = beach.accessDifficulty
    ? (accessMap[beach.accessDifficulty] ?? 0.5)
    : 0.5

  // Blue flag: boolean
  const certs = beach.certifications ? JSON.parse(beach.certifications) : []
  const blueFlagScore = (certs as string[]).includes('blue-flag') ? 1 : 0

  // Child-safe: boolean
  const childSafeScore = beach.childSafe ? 1 : 0

  // Natural shade: boolean
  const shadeScore = beach.naturalShade ? 1 : 0

  return (
    servicesScore * 0.3 +
    lengthScore * 0.15 +
    photoScore * 0.1 +
    accessScore * 0.15 +
    blueFlagScore * 0.15 +
    childSafeScore * 0.1 +
    shadeScore * 0.05
  )
}
