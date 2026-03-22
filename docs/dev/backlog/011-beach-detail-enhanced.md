# Task #011: Enhanced Beach Detail Page

## Metadata
- **Status**: pending
- **Priority**: P1 - Now
- **Slice**: Frontend
- **Created**: 2026-03-22
- **Started**: -
- **Blocked by**: -

## User Story

As a beachgoer, I want to see all available information about a beach on its detail page so that I can decide if it's the right beach for me.

## Acceptance Criteria

- [ ] Photo gallery using `pictures[]` with base URL from turismoregiondemurcia.es
- [ ] Location map using `coordinates` (static map or embedded)
- [ ] Services section with icons from `services[]`
- [ ] Activities section with icons from `activities[]`
- [ ] Tags displayed as badges from `tags[]`
- [ ] "How to get there" section using `access` field
- [ ] Certifications displayed (blue-flag, Q-quality, ecoplayas) with visual badges
- [ ] Practical info card: `length`, `soilType`, `waves`, `occupancyLevel`, `bestSeason`, `orientation`
- [ ] Nearby beaches carousel using `nearby[]` with linked cards
- [ ] Contact info section: `phone`, `email`, `realUrl`
- [ ] Instagram hashtag link using `instagramHashtag`
- [ ] Responsive layout (mobile-first)

## Implementation Notes

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

## Progress Log

(No progress yet)

## Learnings

(None yet)
