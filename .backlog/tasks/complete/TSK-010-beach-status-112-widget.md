---
id: TSK-010
title: Beach Status 112 Widget
status: complete
priority: P4
tags: [frontend]
created: 2026-03-22
source: manual
depends-on: [TSK-003]
completed: 2026-03-27
---

# Beach Status 112 Widget

## Description

As a beachgoer, I want to see real-time beach conditions (lifeguard presence, safety flags, water temperature) so that I can ensure a safe visit.

## Acceptance Criteria

- [ ] Beach status component created displaying flag color, lifeguard status, water temp
- [ ] 112 Murcia XML feed integrated and parsed
- [ ] Beach names matched to database (fuzzy matching)
- [ ] Response cached for 15 minutes
- [ ] Seasonal unavailability handled gracefully (June-September, 9:00-23:00)
- [ ] Off-season message displayed when data unavailable
- [ ] Loading and error states

## Notes

- Endpoint: `https://www.112rmurcia.es/copla/copla.xml`
- Format: XML (use `xml2js` or similar)
- Availability: Summer only (June-September, 9:00-23:00)
- Data: Lifeguard presence, beach conditions, safety flags, water temperature

## Files to Modify

- `src/components/beach-status-widget.tsx` (new)
- `src/routes/playas/$slug.tsx` (integrate widget)
- `src/lib/beach-status-112.ts` (XML parser, new)

## Dependencies

- #003 (Deploy to production - needs server-side API proxy)

## Learnings

(None yet)

## Progress Log

(No progress yet)
- [2026-10-17] Migrated from legacy backlog/ (originally task #010)
