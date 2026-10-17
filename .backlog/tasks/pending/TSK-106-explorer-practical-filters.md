---
id: TSK-106
title: Explorer Practical Filters (Dogs, Lifeguard, Accessibility, Shade, Crowds)
status: pending
priority: P2
tags: [frontend]
created: 2026-10-16
source: manual
depends-on: []
---

# Explorer Practical Filters (Dogs, Lifeguard, Accessibility, Shade, Crowds)

## Description

As a visitor with a specific need (a dog, small children, reduced mobility, wanting shade or a quiet beach), I want to filter beaches on `/explorar` by those needs so that I only see beaches that suit me without opening each detail page.

## Acceptance Criteria

- [ ] `BeachSearchParams` supports boolean filters `dogFriendly`, `lifeguard`, `childSafe`, `naturalShade`, `nudist`, validated in `src/lib/explorer-search.ts` and kept in the URL
- [ ] `BeachSearchParams` supports `accessDifficulty` (`easy` | `moderate` | `hard`, multi-select) and `occupancy` (`low` | `medium` | `high`, multi-select)
- [ ] Filter panel shows a "Necesidades" (or similar) group with these options; active filters appear as chips and count in `countActiveFilters`
- [ ] Beaches with a missing optional field (`undefined`) are excluded when that filter is active, not treated as matches
- [ ] Unit tests in Vitest cover each new filter, including the `undefined` case and combination with existing filters
- [ ] Spanish labels use correct diacritics (e.g. "Accesibilidad", "Socorrista", "Sombra natural", "Poca ocupación")

## Notes

All fields already exist in `data/beaches.json` and `src/types/beach.ts`; no data or schema change needed. Follow the existing pattern in `filterBeaches` (one block per param). Consider whether `accessDifficulty: easy` should be labelled as "Acceso fácil" rather than exposing all three levels — decide during implementation and keep it consistent with the beach detail page wording.

Origin: visitor-perspective UX brainstorm (2026-10-16), top-3 suggestion #2.

## Files to Modify

- `src/lib/beach-filters.ts` (+ tests)
- `src/lib/explorer-search.ts`
- `src/features/listing/filter-panel.tsx`
- `src/features/explorer/active-filter-chips.tsx`
- `src/routes/explorar/index.tsx` (`hasActiveFilters` check)

## Dependencies

-

## Learnings

(None yet)

## Progress Log

(No progress yet)
- [2026-10-17] Migrated from legacy backlog/ (originally task #106)
