---
id: TSK-158
title: Show distance on nearby beach cards
status: complete
priority: P3
tags: [ui, beach-detail, navigation]
created: 2026-11-04
source: manual
depends-on: [TSK-128]
started: 2026-11-07
completed: 2026-11-07
---

# Show distance on nearby beach cards

## Description

Every nearby card on El Rincón repeats "Mazarrón", which adds nothing. Distance would help visitors choose. On desktop the fifth card fades at the edge with no visible control.

## Acceptance Criteria

- [x] Nearby cards show distance from the current beach instead of repeating the municipality when it matches
- [x] Distance formatting reuses the existing formatter
- [x] Desktop shows a visible control for the carousel
- [x] Cards remain reachable by keyboard
- [x] Component tests cover the new label
- [x] pnpm build, pnpm test and pnpm check pass

## Notes

## Learnings

## Progress Log

- [2026-11-04] Created
- [2026-11-04] Depends on TSK-128: nearby cards reuse formatDistance, which has the boundary bug.
- [2026-11-07] Started
- [2026-11-07] Distance computed in the component from coordinates; same municipality shows 'A 600 m', other shows 'Mazarrón · a 3,4 km'; prev/next buttons from lg when more than 4 cards. Commit 6b4a7b3.
- [2026-11-07] Completed