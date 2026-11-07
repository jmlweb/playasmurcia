---
id: TSK-163
title: Fix: Map raw waves enum to Spanish labels
status: complete
priority: P3
tags: [ui, bug, beach-detail]
created: 2026-11-04
source: report/RPT-064
depends-on: [TSK-137]
completed: 2026-11-07
started: 2026-11-07
---

# Fix: Map raw waves enum to Spanish labels

## Description

`practical-info-card.tsx:139` renders `waves` unmapped, so visitors see `MODERADO`. TSK-137 may decide to remove this label, so check it first.

See `.backlog/reports/complete/RPT-064-raw-waves-enum-shown-on.md`.

## Acceptance Criteria

- [x] Más detalles shows Spanish labels for every waves value — evidence: src/lib/beach-facts.ts formatUsualWaves → production shows Oleaje habitual: Moderado (2026-11-07)
- [x] Mapping lives in one shared presentation helper — evidence: src/lib/beach-facts.ts → single helper used by practical-info-card.tsx (2026-11-07)
- [x] Unit test covers the mapping — evidence: src/lib/beach-facts.test.ts → covers TRANQUILO, SIN DETERMINAR and undefined (2026-11-07)
- [x] If TSK-137 removes the static label, this task is closed against that decision — evidence: 28957e0 → static label kept and named habitual, so nothing was removed (2026-11-07)
- [x] pnpm build, pnpm test and pnpm check pass — evidence: CI run 42320793313 on 697b908 → build, check and test green (2026-11-07)

## Notes

## Learnings

## Progress Log

- [2026-11-04] Created
- [2026-11-04] Added dependency on TSK-137, which decides whether the static waves label stays.
- [2026-11-07] Implemented by 28957e0; verified in 2026-11-07 grooming.
- [2026-11-07] Completed