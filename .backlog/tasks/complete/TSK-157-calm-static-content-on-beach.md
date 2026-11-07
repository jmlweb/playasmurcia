---
id: TSK-157
title: Calm static content on beach detail
status: complete
priority: P3
tags: [ui, beach-detail, design-system]
created: 2026-11-04
source: manual
depends-on: [TSK-153]
completed: 2026-11-07
started: 2026-11-07
---

# Calm static content on beach detail

## Description

Servicios and Actividades chips resemble buttons but do nothing, and their blue and sand tints carry no meaning. Weather and Información práctica are shadowed cards, though `docs/ui-guidelines.md` says cards are for clickable items only. Use plain icon lists, and either unbox the sidebar or document it as an exception.

## Acceptance Criteria

- [x] Servicios and Actividades no longer look like clickable buttons — evidence: services-grid.tsx and activities-grid.tsx → plain icon lists (2026-11-07)
- [x] Blue and sand tints are removed unless they carry meaning — evidence: services-grid.tsx and activities-grid.tsx → no blue or sand tints (2026-11-07)
- [x] A decision is recorded on whether Weather and Práctica stay as cards — evidence: DESIGN.md:238 → rail panels are flat with no shadow, border or gradient (2026-11-07)
- [x] Layout verified at 375px and 1280px with scripts/screenshot.ts — evidence: Playwright capture of production at 375 and 1280 on 2026-11-07 → layout confirmed (2026-11-07)
- [x] pnpm build, pnpm test and pnpm check pass — evidence: CI run 42320793313 on 697b908 → build, check and test green (2026-11-07)

## Notes

## Learnings

## Progress Log

- [2026-11-04] Created
- [2026-11-04] Depends on TSK-153: restyle the layout after it is reordered.
- [2026-11-07] Implemented by 28957e0; verified in 2026-11-07 grooming. Moved the ui-guidelines criterion to TSK-160.
- [2026-11-07] Completed