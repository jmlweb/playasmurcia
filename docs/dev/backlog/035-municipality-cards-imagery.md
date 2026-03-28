# Task #035: Add Imagery and Visual Hierarchy to Municipality Cards

## Metadata
- **Status**: pending
- **Priority**: P3
- **Slice**: Styling
- **Created**: 2026-03-28
- **Started**: -
- **Blocked by**: 017

## User Story

As a visitor browsing municipalities, I want visual cues that help me distinguish and be inspired by different coastal areas.

## Context

UI review (2026-03-28) found municipality cards on both the index and homepage are text-only and visually flat. Service icons also render as text IDs (covered by task #030). See `docs/dev/ui-review/processed/municipios-index.md` for full directive.

## Acceptance Criteria

- [ ] Add a representative beach image to each municipality card on `/municipios` (use the first picture from the municipality's most-photographed beach)
- [ ] Create visual size hierarchy: give top municipalities by beach count more visual prominence (e.g., first card spans 2 columns, or display beach count as large number)
- [ ] Strengthen homepage municipality cards with icons or prominent beach counts
- [ ] Add municipality descriptions to the data and display in the hero of municipality detail pages

## Notes

- This task has a dependency on task #017 (source missing beach pictures) for image availability
- If no image exists for a municipality, use an ocean gradient placeholder
- See `docs/dev/ui-review/processed/municipios-index.md` and `docs/dev/ui-review/processed/municipality-detail.md` for detailed directives
