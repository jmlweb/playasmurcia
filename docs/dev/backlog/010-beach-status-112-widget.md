# Task #010: Beach Status 112 Widget

## Metadata
- **Status**: pending
- **Priority**: P4
- **Slice**: Frontend
- **Created**: 2026-03-22
- **Started**: -
- **Blocked by**: #003

## User Story

As a beachgoer, I want to see real-time beach conditions (lifeguard presence, safety flags, water temperature) so that I can ensure a safe visit.

## Acceptance Criteria

- [ ] Beach status component created displaying flag color, lifeguard status, water temp
- [ ] 112 Murcia XML feed integrated and parsed
- [ ] Beach names matched to database (fuzzy matching)
- [ ] Response cached for 15 minutes
- [ ] Seasonal unavailability handled gracefully (June-September, 9:00-23:00)
- [ ] Off-season message displayed when data unavailable
- [ ] Loading and error states

## Implementation Notes

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

## Progress Log

(No progress yet)

## Learnings

(None yet)
