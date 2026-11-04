---
id: TSK-158
title: Show distance on nearby beach cards
status: pending
priority: P3
tags: [ui, beach-detail, navigation]
created: 2026-11-04
source: manual
depends-on: [TSK-128]
---

# Show distance on nearby beach cards

## Description

Every nearby card on El Rincón repeats "Mazarrón", which adds nothing. Distance would help visitors choose. On desktop the fifth card fades at the edge with no visible control.

## Acceptance Criteria

- [ ] Nearby cards show distance from the current beach instead of repeating the municipality when it matches
- [ ] Distance formatting reuses the existing formatter
- [ ] Desktop shows a visible control for the carousel
- [ ] Cards remain reachable by keyboard
- [ ] Component tests cover the new label
- [ ] pnpm build, pnpm test and pnpm check pass

## Notes

## Learnings

## Progress Log

- [2026-11-04] Created
- [2026-11-04] Depends on TSK-128: nearby cards reuse formatDistance, which has the boundary bug.