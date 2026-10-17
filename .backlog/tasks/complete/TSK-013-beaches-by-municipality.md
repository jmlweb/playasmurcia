---
id: TSK-013
title: Beaches by Municipality Pages
status: complete
priority: P2
tags: [frontend]
created: 2026-03-22
source: manual
depends-on: []
started: 2026-03-23
completed: 2026-03-23
---

# Beaches by Municipality Pages

## Description

As a visitor planning a trip to a specific coastal town, I want to see all beaches in that municipality so that I can plan which beaches to visit in that area.

## Acceptance Criteria

- [x] Index page `/municipios` listing all 9 municipalities with beach count and summary stats
- [x] Detail page `/municipios/:slug` showing all beaches for that municipality
- [x] Municipality card shows: name, number of beaches, blue flag count, most common services
- [x] Beach list within municipality reuses beach card component from #012
- [x] SEO: unique title, meta description, JSON-LD for each municipality page
- [x] Breadcrumb navigation (Home > Municipios > Municipality Name)
- [x] Sitemap updated to include municipality pages

## Notes

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

## Learnings

(None yet)

## Progress Log

- [2026-03-23] Task started
- [2026-03-23] Implementation complete: index page, detail page, db queries, schema, sitemap
- [2026-03-23] Code review fixes: removed dead getStaticPaths, fixed Spanish grammar, optimized DB query, added services display
- [2026-03-23] Task completed - all 7 criteria met, 142 tests passing
- [2026-10-17] Migrated from legacy backlog/ (originally task #013)
