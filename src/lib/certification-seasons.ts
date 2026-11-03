import type { Certification } from '@/types/beach'

// Written by scripts/add-certifications.js on each yearly refresh.
import certificationSeasons from '../../data/certification-seasons.json'

const seasonYears: Partial<Record<Certification, number>> = certificationSeasons

export const getCertificationSeasonYear = (
  certification: Certification,
): number | undefined => seasonYears[certification]
