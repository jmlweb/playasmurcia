---
id: TSK-166
title: Fix: Beach detail copy and accessibility defects
status: pending
priority: P4
tags: [ui, bug, accessibility]
created: 2026-11-04
source: report/RPT-067
depends-on: [TSK-153]
---

# Fix: Beach detail copy and accessibility defects

## Description

Service casing, contact link size and Leaflet labels were fixed in a1c1d41 and 28957e0. Two defects remain: gallery alt text is still generic (`foto N de M`, `src/routes/playas/$slug.tsx`), and the hero breadcrumb (`text-white/80` on a photo, `src/components/layout/breadcrumb.tsx:22`) has not been measured.

See `.backlog/reports/complete/RPT-067-small-copy-and-accessibility-defects.md`.

## Acceptance Criteria

- [x] Service name reads Rampa accesible in data, tests and the migrated database — evidence: data/services.json → Rampa accesible, also on production (2026-11-07)
- [x] Contact links are at least 24px tall — evidence: src/features/beaches/contact-info.tsx → links use min-h-11 (2026-11-07)
- [ ] Gallery alt text describes each scene or a clear alternative is recorded
- [x] Leaflet controls expose Spanish labels — evidence: src/features/beaches/leaflet-map.tsx → zoom titles Acercar and Alejar (2026-11-07)
- [ ] Hero breadcrumb contrast is measured and fixed if below 4.5:1
- [ ] pnpm build, pnpm test and pnpm check pass

## Notes

## Learnings

## Progress Log

- [2026-11-04] Created
- [2026-11-04] Depends on TSK-153 ($slug.tsx) and TSK-155 (leaflet-map.tsx).
- [2026-11-07] Narrowed in 2026-11-07 grooming. Removed TSK-155 dependency: its only map item is done.