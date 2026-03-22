# Task #013: Beaches by Municipality Pages

## Metadata
- **Status**: pending
- **Priority**: P2 - Next
- **Slice**: Frontend
- **Created**: 2026-03-22
- **Started**: -
- **Blocked by**: -

## User Story

As a visitor planning a trip to a specific coastal town, I want to see all beaches in that municipality so that I can plan which beaches to visit in that area.

## Acceptance Criteria

- [ ] Index page `/municipios` listing all 9 municipalities with beach count and summary stats
- [ ] Detail page `/municipios/:slug` showing all beaches for that municipality
- [ ] Municipality card shows: name, number of beaches, blue flag count, most common services
- [ ] Beach list within municipality reuses beach card component from #012
- [ ] SEO: unique title, meta description, JSON-LD for each municipality page
- [ ] Breadcrumb navigation (Home > Municipios > Municipality Name)
- [ ] Sitemap updated to include municipality pages

## Implementation Notes

- 9 municipalities: Cartagena, Lorca, Águilas, Mazarrón, San Javier, La Manga, Los Alcázares, San Pedro del Pinatar, La Unión
- Aggregate stats computed from beach data (blue flags, service counts)
- Reuse beach card component from homepage task (#012)
- Municipality slugs derived from name (same pattern as beach slugs)

## Files to Modify

- `src/routes/municipios/index.tsx` (new)
- `src/routes/municipios/$slug.tsx` (new)
- `src/lib/db-data.ts` (add `getBeachesByMunicipality()`, `getMunicipalityBySlug()`)
- `scripts/generate-sitemap.ts` (add municipality URLs)

## Dependencies

- #012 (reuse beach card component)

## Progress Log

(No progress yet)

## Learnings

(None yet)
