---
id: TSK-159
title: Fix beach gallery crops and photo count button
status: complete
priority: P4
tags: [ui, beach-detail, images]
created: 2026-11-04
source: manual
depends-on: [TSK-153]
started: 2026-11-08
completed: 2026-11-08
---

# Fix beach gallery crops and photo count button

## Description

`BeachGallery` in `src/routes/playas/$slug.tsx` is now a capped mosaic that starts at photo 2. At 375px the main tile is about 223×214, so 2233×727 panoramas are still cropped heavily, and they looked soft on the 2x mobile capture. "Ver las 5 fotos" spans x 196-347 across the tile gap at 239-247 on `/playas/playa-de-el-rincon`.

## Acceptance Criteria

- [x] Panoramic photos are no longer cropped into near-square tiles — evidence: Phones: main tile aspect-[16/9] full width, stacked tiles aspect-[4/3] in a row (Playwright: 354x199 on /playas/playa-de-el-rincon) (2026-11-08)
- [x] Images look sharp on a 2x display at 375px — evidence: fullSizes 200vw on phones → 1600w source (1395x454 natural for a 354x199 tile) (2026-11-08)
- [x] Ver las N fotos no longer straddles two tiles at 375px — evidence: Button max-sm:w-full (x 16-359 at 375px) (2026-11-08)
- [x] Layout verified at 375px and 1280px with scripts/screenshot.ts — evidence: Playwright element screenshots at 375px and 1280px reviewed (2026-11-08)
- [x] pnpm build, pnpm test and pnpm check pass — evidence: pnpm build, pnpm test, pnpm check exit 0 (2026-11-08) (2026-11-08)

## Notes

## Learnings

## Progress Log

- [2026-11-04] Created
- [2026-11-04] Depends on TSK-153: both edit src/routes/playas/$slug.tsx.
- [2026-11-08] Started
- [2026-11-08] Commit 11989ad. Desktop keeps the 2fr/1fr mosaic; sizes 1200px from lg for panoramas.
- [2026-11-08] Completed