---
id: TSK-094
title: Beach Detail Empty States and Trust Polish
status: complete
priority: P1
tags: [styling]
created: 2026-04-02
source: manual
depends-on: []
started: 2026-04-02
completed: 2026-04-02
---

# Beach Detail Empty States and Trust Polish

## Description

As a user on a beach detail page, I want secondary widgets (weather, status) to feel clearly secondary when data is missing, and I want hero metadata to meet contrast expectations.

## Acceptance Criteria

- [x] **Degraded states**: Differentiate weather-unavailable and out-of-season beach status cards from `PracticalInfoCard` (lighter shadow, dashed border, and/or muted icon treatment per directive).
- [x] **Hero tag pills** on beach detail: verify WCAG AA text contrast on gradient/photo heroes; darken text or adjust pill opacity if needed.
- [x] Optional: gallery `gap` alignment with site spacing scale per directive.
- [x] `pnpm build`, `pnpm test`, and `pnpm check` pass.

## Context

UI review (2026-04-02): empty weather/status cards compete visually with primary practical info; hero tag pills may need contrast check on photo heroes.

## Source Reports

- `.backlog/reports/complete/RPT-004-beach-detail-playasslug-ui-review.md`

## Notes

## Learnings

## Progress Log

- [2026-04-02 02:10] Differentiated degraded weather widget (error state): dashed border, reduced shadow, muted text
- [2026-04-02 02:12] Differentiated off-season beach status: dashed border, reduced shadow, muted text colors
- [2026-04-02 02:14] Updated gallery gap from 3 to 5 (spacing scale consistency)
- [2026-04-02 02:14] Verified hero tags use variant="dark" (white text on gradient) — contrast sufficient
- [2026-04-02 02:14] All checks pass (build, test, check)
- [2026-04-02 02:14] Task completed
- [2026-10-17] Migrated from legacy backlog/ (originally task #094)
