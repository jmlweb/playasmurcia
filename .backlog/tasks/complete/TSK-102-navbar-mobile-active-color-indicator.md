---
id: TSK-102
title: Navbar — Mobile Active Link Matches Desktop Color Cue
status: complete
priority: P3
tags: [styling]
created: 2026-04-04
source: manual
depends-on: []
completed: 2026-04-04
---

# Navbar — Mobile Active Link Matches Desktop Color Cue

## Description

As a mobile user with the menu open, I want to see which top-level section (Playas / Colecciones) is active, using the same visual language as on desktop.

## Acceptance Criteria

- [x] Active `simpleNavLinks` in the mobile drawer show a **visible ocean accent** consistent with desktop (left border bar `border-l-2 border-ocean-400 pl-2`).
- [x] Inactive links remain `text-ocean-200` with hover/focus to white; focus-visible ring unchanged.
- [x] `pnpm build`, `pnpm test`, and `pnpm check` pass.

## Context

UI review (color focus, Playwright, 2026-04-04). Full directive: `.backlog/reports/complete/RPT-035-ui-review-color-focus-2026-04-04.md`. Desktop `simpleNavLinks` use `border-b-2 border-ocean-400` when active (`src/components/layout/navbar.tsx` ~212–214). Mobile drawer links use only `text-white` when active (~294), so the ocean accent is missing.

## Files to Modify

- `src/components/layout/navbar.tsx` (mobile `simpleNavLinks` `activeProps` / layout)

## Dependencies

- None

## Notes

## Learnings

## Progress Log

- [2026-04-04] Task created from UI review (colors).
- [2026-04-04] Completed: added left border-l-2 border-ocean-400 active indicator to mobile drawer links.
- [2026-10-17] Migrated from legacy backlog/ (originally task #102)
