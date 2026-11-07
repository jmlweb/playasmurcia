---
id: TSK-166
title: Fix: Beach detail copy and accessibility defects
status: complete
priority: P4
tags: [ui, bug, accessibility]
created: 2026-11-04
source: report/RPT-067
depends-on: [TSK-153]
started: 2026-11-07
completed: 2026-11-07
---

# Fix: Beach detail copy and accessibility defects

## Description

Service casing, contact link size and Leaflet labels were fixed in a1c1d41 and 28957e0. Two defects remain: gallery alt text is still generic (`foto N de M`, `src/routes/playas/$slug.tsx`), and the hero breadcrumb (`text-white/80` on a photo, `src/components/layout/breadcrumb.tsx:22`) has not been measured.

See `.backlog/reports/complete/RPT-067-small-copy-and-accessibility-defects.md`.

## Acceptance Criteria

- [x] Service name reads Rampa accesible in data, tests and the migrated database — evidence: data/services.json → Rampa accesible, also on production (2026-11-07)
- [x] Contact links are at least 24px tall — evidence: src/features/beaches/contact-info.tsx → links use min-h-11 (2026-11-07)
- [x] Gallery alt text describes each scene or a clear alternative is recorded
- [x] Leaflet controls expose Spanish labels — evidence: src/features/beaches/leaflet-map.tsx → zoom titles Acercar and Alejar (2026-11-07)
- [x] Hero breadcrumb contrast is measured and fixed if below 4.5:1
- [x] pnpm build, pnpm test and pnpm check pass

## Notes

## Learnings

## Progress Log

- [2026-11-04] Created
- [2026-11-04] Depends on TSK-153 ($slug.tsx) and TSK-155 (leaflet-map.tsx).
- [2026-11-07] Narrowed in 2026-11-07 grooming. Removed TSK-155 dependency: its only map item is done.
- [2026-11-07] Started
- [2026-11-07] Alt text decision: pictures carry only filenames, so no scene description is possible; gallery alt is now '<beach>, <municipality>: fotografía N de M' via a municipalityName prop on BeachGallery; no empty alt because the mosaic starts at photo 2 and the lightbox counter needs the index. Breadcrumb measured on production heroes with sharp per-pixel compositing: text-white/80 desktop minimums 2.58 to 3.69:1 (Bolnuevo, La Isla, Calblanque, El Rincón). Fixed with solid text-white and a stronger desktop scrim in beach-hero.tsx (via 55% at 55%, to 20%): minimums 4.72 to 6.42:1 desktop, 5.77+ mobile. Guidelines breadcrumb tone updated. Commit e4fa676, merged 5c183c0.
- [2026-11-07] Completed