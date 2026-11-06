---
id: RPT-072
title: Desktop bar on landscape phones has small touch targets
type: improvement
severity: medium
status: triaged
created: 2026-11-06
triaged: 2026-11-06
task-id: TSK-171
---

## Summary

The desktop bar starts at `sm` (640px), so every phone in landscape gets it. Its touch targets are far below the 44px the phone layout uses.

## Details

Commit 41c5d16 fixed the popover overflow at short heights but deliberately kept the `sm` breakpoint. The touch target problem from the 2026-11-06 topbar critique remains.

## Current Behavior

- From 640px, nav links are 20px tall and the search control is 26px tall, against 44px on phones.
- Popover rows measured 32px at 820px touch, before the popover was rebuilt in 41c5d16. Row classes were kept, so this should still hold; re-measure.
- Targets pass WCAG 2.5.8 only through spacing.
- The Colecciones popover opens on hover and on tap. Touch users only get the tap path.
- `SM_BREAKPOINT_QUERY` (`src/components/layout/navbar.tsx:28`) and the `sm:` classes in the bar and mobile panel all assume this breakpoint.

## Proposed Change

Pick one:

1. Move the desktop bar to `md` (768px). Most phones in landscape then keep the hamburger. This touches all bar and panel `sm:` classes and `SM_BREAKPOINT_QUERY`.
2. Gate the small sizes on `(hover: hover)`, so touch devices keep 44px targets at any width.
3. Raise target height on `sm` and up with padding, keeping the visual size and 61px bar height.

Option 2 also covers tablets, where option 1 does not.

## Expected Benefit

The project's own 44px standard holds on touch screens at every width, including the phone scene PRODUCT.md calls common.
