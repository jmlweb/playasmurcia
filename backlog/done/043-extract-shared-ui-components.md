# Task #043: Extract Shared UI Components and Standardize Patterns

## Metadata
- **Status**: pending
- **Priority**: P3
- **Slice**: Styling
- **Created**: 2026-03-28
- **Started**: -
- **Blocked by**: -

## User Story

As a developer, I want shared UI patterns extracted into reusable components so the site stays consistent as it grows.

## Context

UI review (2026-03-28) found several duplicated patterns with inconsistent implementations across pages. See `reports/done/cross-cutting.md` (CC-3, CC-5, CC-6, CC-7).

## Acceptance Criteria

- [ ] Create `EmptyState` component: consistent icon color (`text-gray-300`), border (`border border-dashed border-gray-200`), padding (`rounded-2xl py-20`), with slots for title, description, optional action
- [ ] Replace empty states on municipality detail, collection detail, and explorer with the shared component
- [ ] Extract `PageInfo` component for "Pagina X de Y (N playas)" text used on 3 pages
- [ ] Standardize back/navigation links at page bottom: use consistent verb ("Volver a {section}")
- [ ] Standardize beach card grid gaps: `gap-5 xl:gap-6` on all grid pages (homepage can keep `gap-6 xl:gap-8`)

## Notes

- Low risk, high consistency gain
- See `reports/done/cross-cutting.md` for all details
