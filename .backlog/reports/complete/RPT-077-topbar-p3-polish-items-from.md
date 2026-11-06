---
id: RPT-077
title: Topbar P3 polish items from the critique
type: improvement
severity: low
status: triaged
created: 2026-11-06
triaged: 2026-11-06
task-id: TSK-177
---

## Summary

P3 items from the 2026-11-06 topbar critique, left out of commit 41c5d16 by scope. All are small and live in `src/components/layout/navbar.tsx`.

## Current Behavior

1. Active item text rises 2px, because border and padding exist only when active (`:39`, `:269`). Box heights 24 vs 20.
2. Two focus rings: `darkFocusRing` (white/70 with offset) and `ring-ocean-400` without offset (`:280`, `:317`). The ring hugs the text and crosses the active underline.
3. Search icon is 18px and ocean-300 on desktop (`:280`, `:299`). Links are ocean-200, and DESIGN.md asks for 20 or 24px icons.
4. Popover geometry: measured overlapping the bar by 9px and running 100px past the container at 1440. Both figures predate the narrower `w-72` popover from 41c5d16, so re-measure first.
5. Hardcoded `73px` in the phone panel (`:358`) leaves a 1px sliver of page. Panel starts at 72 and ends at 666 of 667.
6. Chevron rotation stays 150ms under `prefers-reduced-motion` (`:43`, `:118`).
7. Hover then click leaves the popover open after the pointer leaves. Arguably useful, but undiscoverable. Decide whether to keep it.
8. Phone menu text is 14px. 16px would suit the primary scene better.

## Proposed Change

1. Reserve the space with `border-b-2 border-transparent pb-0.5` on inactive items.
2. Use one ring. Apply `darkFocusRing` to search and the menu toggle.
3. Use 20px and ocean-200.
4. Anchor to the header or raise `sideOffset`, if the problem still shows.
5. Derive the height, or end the panel at the viewport bottom without a fixed number.
6. Use `motion-safe:transition-transform`.
7. Keep or change after a decision.
8. Raise phone rows to `text-base`.

Items 1 and 2 were only seen in screenshots on a different build (`:3100`), with box heights confirmed on `:3001`. Check them on the current build.

## Expected Benefit

Consistent focus and active states, full reduced-motion compliance and no layout shift between states.
