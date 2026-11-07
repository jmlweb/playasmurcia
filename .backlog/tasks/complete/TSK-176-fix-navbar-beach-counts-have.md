---
id: TSK-176
title: Fix: Navbar beach counts have no unit for screen readers
status: complete
priority: P4
tags: [bug, navbar, accessibility]
created: 2026-11-06
source: report/RPT-076
depends-on: [TSK-175]
started: 2026-11-07
completed: 2026-11-07
---

# Fix: Navbar beach counts have no unit for screen readers

## Description

### Summary

Collection counts in the navbar are read without a unit, for example "Mar Menor 43".

### Details

Links render the label and a bare number at `src/components/layout/navbar.tsx:69` (popover) and `:137` (phone menu). The 2026-11-06 critique reported this on the municipality rows too; those rows left the navbar in 41c5d16.

### Fix direction

Add a visually hidden unit after each count, as `coast-today-strip.tsx` already does for weather:

`{c.count}<span className="sr-only"> playas</span>`

Use "1 playa" for a count of one. Update tests that match link names (`src/components/layout/navbar.test.tsx`).

Source report: `.backlog/reports/complete/RPT-076-navbar-beach-counts-have-no.md`

## Acceptance Criteria

- [x] Popover and phone menu counts expose a visually hidden unit: "43 playas", and "1 playa" for a count of one
- [x] Visible layout does not change
- [x] Tests that match link names are updated

## Notes

## Learnings

## Progress Log

- [2026-11-06] Created
- [2026-11-07] Tagged in 2026-11-07 grooming. Navbar tasks run in order 175, 176, 174, 177, 171 because they edit the same file.
- [2026-11-07] Started
- [2026-11-07] sr-only unit via beachCountUnit helper. Commit e24366f.
- [2026-11-07] Completed