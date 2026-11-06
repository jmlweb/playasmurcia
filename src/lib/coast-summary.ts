type CountedMunicipality = {
  beachCount: number
}

export type CoastSummary = {
  beachCount: number
  municipalityCount: number
}

// Separate from nav-builders so the footer does not pull collection filters
// into the client bundle; the root loader imports those dynamically.
export function summarizeCoast(
  municipalities: readonly CountedMunicipality[],
): CoastSummary {
  const coastal = municipalities.filter((m) => m.beachCount > 0)
  return {
    beachCount: coastal.reduce((total, m) => total + m.beachCount, 0),
    municipalityCount: coastal.length,
  }
}
