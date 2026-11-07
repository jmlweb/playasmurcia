---
id: TSK-171
title: Fix: Desktop bar on landscape phones has small touch targets
status: complete
priority: P3
tags: [bug, navbar, accessibility]
created: 2026-11-06
source: report/RPT-072
depends-on: [TSK-177]
started: 2026-11-07
completed: 2026-11-07
---

# Fix: Desktop bar on landscape phones has small touch targets

## Description

### Summary

The desktop bar starts at `sm` (640px), so every phone in landscape gets it. Its touch targets are far below the 44px the phone layout uses. Commit 41c5d16 fixed the popover overflow at short heights but deliberately kept the `sm` breakpoint.

### Details

- From 640px, nav links are 20px tall and the search control is 26px tall, against 44px on phones.
- Popover rows measured 32px at 820px touch, before the popover was rebuilt in 41c5d16. Row classes were kept, so re-measure.
- Targets pass WCAG 2.5.8 only through spacing.
- The Colecciones popover opens on hover and on tap. Touch users only get the tap path.
- `SM_BREAKPOINT_QUERY` (`src/components/layout/navbar.tsx:28`) and the `sm:` classes in the bar and mobile panel all assume this breakpoint.

### Fix options

1. Move the desktop bar to `md` (768px). Touches all bar and panel `sm:` classes and `SM_BREAKPOINT_QUERY`.
2. Gate the small sizes on `(hover: hover)`, so touch devices keep 44px targets at any width. Also covers tablets, where option 1 does not.
3. Raise target height on `sm` and up with padding, keeping the visual size and 61px bar height.

Source report: `.backlog/reports/complete/RPT-072-desktop-bar-on-landscape-phones.md`

## Acceptance Criteria

- [x] Popover row height re-measured at touch widths before choosing the fix
- [x] One option chosen and recorded: move bar to md, gate small sizes on (hover: hover), or raise target height with padding
- [x] Navbar links, search control and popover rows are 44px tall on touch screens at every width from 640px
- [x] Visual bar height and desktop pointer layout stay unchanged, or any change is recorded in the task

## Notes

## Learnings

## Progress Log

- [2026-11-06] Created
- [2026-11-07] Tagged in 2026-11-07 grooming. Navbar tasks run in order 175, 176, 174, 177, 171 because they edit the same file.
- [2026-11-07] Started
- [2026-11-07] Re-measured with hasTouch at 640x360, 740x360, 820x400, 1024x768 after TSK-177: links 24px, search 28x28, popover rows 32px, bar 61px. Option chosen: (b) gate on the pointer with the existing pointer-coarse: variant (touchNavTarget: -my-3 min-h-11; touchSearchTarget: 44x44 control with matching margin box; popover rows and Ver todas min-h-11). After: links, search and rows 44px on touch at every width from 640; bar stays 61px; desktop 1440 no-touch rects identical (8-pixel diff inside the chevron transition). Commit 8d73bda, merged f1642bc.
- [2026-11-07] Completed