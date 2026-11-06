---
id: TSK-153
title: Beach detail: surface safety and key facts first
status: complete
priority: P2
tags: [ui, beach-detail, accessibility]
created: 2026-11-04
source: manual
depends-on: [TSK-168]
started: 2026-11-05
completed: 2026-11-06
---

# Beach detail: surface safety and key facts first

## Description

On `/playas/playa-de-el-rincon` the facts visitors need to decide are buried. "No hay socorrista" sits inside a sentence. At 375px, Información práctica starts at about 1629px and the directions button sits about 3000px down, because the forecast comes first. Length, shade and orientation hide behind "Más detalles", while three tiles leave a hole in the grid.

Show a safety warning near the top, move key facts above weather on mobile, flatten about 6 facts, and add an early directions link. The current order comes from `src/routes/playas/$slug.tsx:223-265`.

## Acceptance Criteria

- [x] A beach without lifeguard shows a visible warning near the top of the page, not only inside the description — evidence: beach-safety-bar test warns on no lifeguard; manual: /playas/playa-de-el-rincon at 375px shows it under the hero (2026-11-06) (2026-11-06)
- [x] At 375px, key facts appear before the weather forecast — evidence: manual: 375px full-page screenshot shows Información práctica before Previsión meteorológica (2026-11-05) (2026-11-06)
- [x] Length, shade and orientation are visible without opening a disclosure — evidence: practical-info-card test asserts no details element; manual: seen in screenshots (2026-11-05) (2026-11-06)
- [x] A directions link is reachable near the top of the page on mobile — evidence: manual: full-width Cómo llegar button under the hero at 375px (2026-11-05) (2026-11-06)
- [x] Layout verified at 375px and 1280px with scripts/screenshot.ts — evidence: manual: scripts/screenshot.ts on el-rincon at 375px and 1280px, cala-cortina at 375px only (2026-11-05) (2026-11-06)
- [x] pnpm build, pnpm test and pnpm check pass — evidence: pnpm build, pnpm test, pnpm check → exit 0 on merged main (2026-11-06) (2026-11-06)

## Notes

## Learnings

## Progress Log

- [2026-11-04] Created
- [2026-11-04] Depends on TSK-168: both edit src/routes/playas/$slug.tsx, so they must not run in parallel worktrees.
- [2026-11-05] Started
- [2026-11-06] Completed