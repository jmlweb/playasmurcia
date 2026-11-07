---
id: TSK-175
title: Fix: Colecciones popover has no accessible name
status: complete
priority: P4
tags: [bug, navbar, accessibility]
created: 2026-11-06
source: report/RPT-075
depends-on: []
started: 2026-11-07
completed: 2026-11-07
---

# Fix: Colecciones popover has no accessible name

## Description

### Summary

The Colecciones popover exposes `role="dialog"` with no accessible name.

### Steps to Reproduce

1. On a viewport of 640px or wider, open the "Colecciones" trigger.
2. Inspect the popup's accessible name.

Expected: the dialog is announced as "Colecciones". Actual: an unnamed dialog.

### Details

`Popover.Popup` at `src/components/layout/navbar.tsx:55` has neither `aria-label` nor a `Popover.Title`. The fix is `aria-label="Colecciones"`, plus a test. A visible title would bring back the eyebrow label removed in 41c5d16, so prefer the attribute.

Found by source and DOM reading in the 2026-11-06 critique. No real screen reader was used.

Source report: `.backlog/reports/complete/RPT-075-colecciones-popover-has-no-accessible.md`

## Acceptance Criteria

- [x] The Colecciones popover dialog has the accessible name "Colecciones"
- [x] No visible title or eyebrow label is added
- [x] A test asserts the accessible name

## Notes

## Learnings

## Progress Log

- [2026-11-06] Created
- [2026-11-07] Tagged in 2026-11-07 grooming. Navbar tasks run in order 175, 176, 174, 177, 171 because they edit the same file.
- [2026-11-07] Started
- [2026-11-07] aria-label on Popover.Popup. Commit 57463ad.
- [2026-11-07] Completed