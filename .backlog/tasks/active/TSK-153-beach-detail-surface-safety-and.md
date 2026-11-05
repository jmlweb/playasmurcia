---
id: TSK-153
title: Beach detail: surface safety and key facts first
status: active
priority: P2
tags: [ui, beach-detail, accessibility]
created: 2026-11-04
source: manual
depends-on: [TSK-168]
started: 2026-11-05
---

# Beach detail: surface safety and key facts first

## Description

On `/playas/playa-de-el-rincon` the facts visitors need to decide are buried. "No hay socorrista" sits inside a sentence. At 375px, Información práctica starts at about 1629px and the directions button sits about 3000px down, because the forecast comes first. Length, shade and orientation hide behind "Más detalles", while three tiles leave a hole in the grid.

Show a safety warning near the top, move key facts above weather on mobile, flatten about 6 facts, and add an early directions link. The current order comes from `src/routes/playas/$slug.tsx:223-265`.

## Acceptance Criteria

- [ ] A beach without lifeguard shows a visible warning near the top of the page, not only inside the description
- [ ] At 375px, key facts appear before the weather forecast
- [ ] Length, shade and orientation are visible without opening a disclosure
- [ ] A directions link is reachable near the top of the page on mobile
- [ ] Layout verified at 375px and 1280px with scripts/screenshot.ts
- [ ] pnpm build, pnpm test and pnpm check pass

## Notes

## Learnings

## Progress Log

- [2026-11-04] Created
- [2026-11-04] Depends on TSK-168: both edit src/routes/playas/$slug.tsx, so they must not run in parallel worktrees.
- [2026-11-05] Started