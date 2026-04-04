# Task #102: Navbar — Mobile Active Link Matches Desktop Color Cue

## Metadata

- **Status**: done
- **Priority**: P3
- **Slice**: Styling
- **Created**: 2026-04-04
- **Blocked by**: -

## User Story

As a mobile user with the menu open, I want to see which top-level section (Playas / Colecciones) is active, using the same visual language as on desktop.

## Context

UI review (color focus, Playwright, 2026-04-04). Full directive: `reports/done/ui-review-2026-04-04-colors.md`. Desktop `simpleNavLinks` use `border-b-2 border-ocean-400` when active (`src/components/layout/navbar.tsx` ~212–214). Mobile drawer links use only `text-white` when active (~294), so the ocean accent is missing.

## Acceptance Criteria

- [x] Active `simpleNavLinks` in the mobile drawer show a **visible ocean accent** consistent with desktop (left border bar `border-l-2 border-ocean-400 pl-2`).
- [x] Inactive links remain `text-ocean-200` with hover/focus to white; focus-visible ring unchanged.
- [x] `pnpm build`, `pnpm test`, and `pnpm check` pass.

## Files to Modify

- `src/components/layout/navbar.tsx` (mobile `simpleNavLinks` `activeProps` / layout)

## Dependencies

- None

## Progress Log

- [2026-04-04] Task created from UI review (colors).
- [2026-04-04] Completed: added left border-l-2 border-ocean-400 active indicator to mobile drawer links.
