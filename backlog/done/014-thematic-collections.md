# Task #014: Thematic Beach Collections

## Metadata
- **Status**: pending
- **Priority**: P2 - Next
- **Slice**: Frontend
- **Created**: 2026-03-22
- **Started**: -
- **Blocked by**: -

## User Story

As a visitor with specific preferences, I want to browse curated beach collections (family-friendly, hidden coves, dog beaches, etc.) so that I can find exactly what I'm looking for.

## Acceptance Criteria

- [ ] Index page `/colecciones` listing all available collections with description and beach count
- [ ] Detail page `/colecciones/:slug` showing beaches matching that collection's criteria
- [ ] Minimum collections implemented:
  - Calas escondidas (tags: calas + aislada/salvaje)
  - Playas familiares (tags: familiar + aguas-tranquilas, lifeguard: true)
  - Playas para perros (dogFriendly: true)
  - Playas nudistas (nudist: true)
  - Con chiringuito (service: chiringuito)
  - Bandera azul (certifications: blue-flag)
  - Para hacer snorkel (activities: snorkeling, tags: snorkel)
  - Deportes acuáticos (activities: kayak/paddleboard/windsurf/kitesurf)
  - Mejores atardeceres (tags: puesta-sol, orientation: west/southwest)
  - Playas poco masificadas (occupancyLevel: low)
  - Accesibles (tags: accesible, services: wheelchair-ramp)
  - Playas fotogénicas (tags: fotogenica)
- [ ] Each collection has: title, description, filter criteria, hero image
- [ ] SEO: unique title, meta description per collection (high SEO value)
- [ ] Collections defined as data (easy to add new ones without code changes)
- [ ] Reuses beach card component from #012

## Implementation Notes

- Collections are predefined filter combinations — define as a config array
- Each collection = `{ slug, title, description, criteria: FilterCriteria }`
- Filter criteria can combine: tags, services, activities, booleans, occupancy, orientation, certifications
- Very high SEO impact: long-tail keywords like "playas para perros murcia", "calas escondidas murcia"
- Consider adding collection links to homepage for discovery

## Files to Modify

- `src/routes/colecciones/index.tsx` (new)
- `src/routes/colecciones/$slug.tsx` (new)
- `src/lib/collections.ts` (new — collection definitions)
- `src/lib/db-data.ts` (add filtered beach queries or use client-side filtering)
- `scripts/generate-sitemap.ts` (add collection URLs)

## Dependencies

- #012 (reuse beach card component)

## Progress Log

(No progress yet)

## Learnings

(None yet)
