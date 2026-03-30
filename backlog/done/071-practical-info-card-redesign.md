# Task #071: PracticalInfoCard Redesign

## Metadata

- **Status**: completed
- **Priority**: P3 - Nice
- **Slice**: UI
- **Created**: 2026-03-30
- **Completed**: 2026-03-30
- **Blocked by**: -

## User Story

As a visitor, I want practical beach information presented clearly so that I can quickly find key details like access, facilities, and conditions.

## Context

UI audit (2026-03-29) flagged the current PracticalInfoCard as a dense wall of `border-b` separated rows. Information hierarchy is flat, making it hard to scan.

## Acceptance Criteria

- [x] Redesign as 2-column grid for grouped info items
- [x] Extract top 3–4 most useful facts into a visible summary grid
- [x] Collapse remaining details into an expandable accordion section
- [x] Use card-based groupings replacing `border-b` separator lines
- [x] More prominent badge-styled values for key metrics
- [x] Map `beach.orientation` through a Spanish label map (e.g., "east" → "Este")
- [x] Move ContactInfo closer to the map

## Source Reports

- `reports/done/ui-audit-2026-03-29.md` — C4, C5, PIC1
- `reports/done/beach-detail.md` — BD1
