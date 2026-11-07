---
id: TSK-177
title: Fix: Topbar P3 polish items from the critique
status: active
priority: P4
tags: [ui, navbar]
created: 2026-11-06
source: report/RPT-077
depends-on: [TSK-174]
started: 2026-11-07
---

# Fix: Topbar P3 polish items from the critique

## Description

### Summary

P3 items from the 2026-11-06 topbar critique, left out of commit 41c5d16 by scope. All are small and live in `src/components/layout/navbar.tsx`.

### Items and proposed fixes

1. Active item text rises 2px, because border and padding exist only when active (`:39`, `:256`). Box heights 24 vs 20. Reserve the space with `border-b-2 border-transparent pb-0.5` on inactive items.
2. Two focus rings: `darkFocusRing` (white/70 with offset) and `ring-ocean-400` without offset (`:267`, `:304`). The ring hugs the text and crosses the active underline. Apply `darkFocusRing` to search and the menu toggle.
3. Search icon is 18px and ocean-300 on desktop (`:267`, `:286`). Links are ocean-200, and DESIGN.md asks for 20 or 24px icons. Use 20px and ocean-200.
4. Popover geometry: measured overlapping the bar by 9px and running 100px past the container at 1440. Both figures predate the narrower `w-72` popover from 41c5d16, so re-measure first. Anchor to the header or raise `sideOffset`, if the problem still shows.
5. Hardcoded `73px` in the phone panel (`:345`) leaves a 1px sliver of page. Panel starts at 72 and ends at 666 of 667. Derive the height, or end the panel at the viewport bottom without a fixed number.
6. Chevron rotation stays 150ms under `prefers-reduced-motion` (`:43`, `:119`). Use `motion-safe:transition-transform`.
7. Hover then click leaves the popover open after the pointer leaves. Arguably useful, but undiscoverable. Decide whether to keep it.
8. Phone menu text is 14px. Raise phone rows to `text-base`.

Items 1 and 2 were only seen in screenshots on a different build (`:3100`), with box heights confirmed on `:3001`. Check them on the current build.

Source report: `.backlog/reports/complete/RPT-077-topbar-p3-polish-items-from.md`

## Acceptance Criteria

- [ ] Active and inactive nav items have equal box height, with no text shift
- [ ] Search and menu toggle use darkFocusRing, so the bar has one focus ring
- [ ] Search icon is 20px and ocean-200 on desktop
- [ ] Popover geometry re-measured at 1440; anchored or offset only if overlap still shows
- [ ] Phone panel has no hardcoded 73px and leaves no sliver of page
- [ ] Chevron rotation does not animate under prefers-reduced-motion
- [ ] Hover-then-click popover behaviour decided and recorded in the task
- [ ] Phone menu rows use text-base
- [ ] Items 1 and 2 checked on the current build

## Notes

## Learnings

## Progress Log

- [2026-11-06] Created
- [2026-11-07] Tagged in 2026-11-07 grooming. Navbar tasks run in order 175, 176, 174, 177, 171 because they edit the same file.
- [2026-11-07] Started