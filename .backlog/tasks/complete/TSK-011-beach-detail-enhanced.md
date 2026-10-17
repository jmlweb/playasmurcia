---
id: TSK-011
title: Enhanced Beach Detail Page
status: complete
priority: P1
tags: [frontend]
created: 2026-03-22
source: manual
depends-on: []
started: 2026-03-23
completed: 2026-03-23
---

# Enhanced Beach Detail Page

## Description

As a beachgoer, I want to see all available information about a beach on its detail page so that I can decide if it's the right beach for me.

## Acceptance Criteria

- [x] Photo gallery using `pictures[]` with base URL from turismoregiondemurcia.es
- [x] Location map using `coordinates` (static map or embedded)
- [x] Services section with icons from `services[]`
- [x] Activities section with icons from `activities[]`
- [x] Tags displayed as badges from `tags[]`
- [x] "How to get there" section using `access` field
- [x] Certifications displayed (blue-flag, Q-quality, ecoplayas) with visual badges
- [x] Practical info card: `length`, `soilType`, `waves`, `occupancyLevel`, `bestSeason`, `orientation`
- [x] Nearby beaches carousel using `nearby[]` with linked cards
- [x] Contact info section: `phone`, `email`, `realUrl`
- [x] Instagram hashtag link using `instagramHashtag`
- [x] Responsive layout (mobile-first)

## Notes

- All data fields already exist in the database — no new queries needed
- The current detail page only shows: name, municipality, description
- Pictures base URL: `https://www.turismoregiondemurcia.es/webs/murciaturistica/fotos/1/playas/`
- Services and activities have `icon` field for visual display
- Nearby beaches need to be fetched by code to get name/slug for links
- Consider sections with expandable/collapsible behavior on mobile

## Files to Modify

- `src/routes/playas/$slug.tsx` (main changes)
- `src/lib/db-data.ts` (add query for nearby beaches by codes)
- `src/components/` (new components: photo-gallery, services-grid, nearby-carousel, etc.)

## Dependencies

- None (all data already available)

## Learnings

(None yet)

## Progress Log

- [2026-03-23] Task started
- [2026-03-23] Implementation completed: 9 new components, route redesign, accessibility fixes, all criteria met
- [2026-03-23] Code review approved - all fixes applied, ready for merge
- [2026-10-17] Migrated from legacy backlog/ (originally task #011)
