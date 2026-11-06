---
id: RPT-075
title: Colecciones popover has no accessible name
type: bug
severity: low
status: triaged
created: 2026-11-06
triaged: 2026-11-06
task-id: TSK-175
---

## Summary

The Colecciones popover exposes `role="dialog"` with no accessible name.

## Steps to Reproduce

1. On a viewport of 640px or wider, open the "Colecciones" trigger.
2. Inspect the popup's accessible name.

## Expected vs Actual

- Expected: the dialog is announced as "Colecciones".
- Actual: an unnamed dialog.

## Details

`Popover.Popup` at `src/components/layout/navbar.tsx:55` has neither `aria-label` nor a `Popover.Title`. The fix is `aria-label="Colecciones"`, plus a test. A visible title would bring back the eyebrow label removed in 41c5d16, so prefer the attribute.

Found by source and DOM reading in the 2026-11-06 critique. No real screen reader was used.

## Error Messages

None.
