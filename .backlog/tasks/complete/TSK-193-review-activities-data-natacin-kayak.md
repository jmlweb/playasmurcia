---
id: TSK-193
title: Review activities data: Natación, Kayak, Snorkel and Pesca are on nearly every beach
status: complete
priority: P3
tags: [data, content]
created: 2026-11-09
source: report/RPT-081
depends-on: []
started: 2026-11-14
completed: 2026-11-14
---

# Review activities data: Natación, Kayak, Snorkel and Pesca are on nearly every beach

## Description

Activity counts over 193 beaches: Natación 193, Kayak 193, Snorkel 189, Pesca 167. The Actividades block reads the same on almost every beach page and the Snorkel and Pesca filters remove almost nothing. Decide per activity whether to source it properly (rocky bottom and clear water for snorkel, permitted fishing zones) or to stop showing and filtering by it. Source: .backlog/reports/complete/RPT-081-full-site-review-2026-11-09-findings.md.

## Acceptance Criteria

- [x] Decision recorded per activity in docs/business-rules.md
- [x] No activity filter matches more than about two thirds of the beaches, or the filter is removed
- [x] Beach pages do not list activities that apply to every beach

## Notes

## Learnings

- LRN-048: Hide uninformative activity data at the display layer, not in beaches.json
## Progress Log

- [2026-11-09] Created
- [2026-11-14] Started
- [2026-11-14] criterion 1 — evidence: docs/business-rules.md gains an Activities section with one decision per activity (Natación, Kayak, Snorkel, Pesca unlisted; others listed) → recorded (2026-11-14)
- [2026-11-14] criterion 2 — evidence: NODE_ENV=development pnpm vitest run src/lib/activities.test.ts src/features/listing/filter-panel.test.tsx → listed activities each on ≤ 2/3 of data/beaches.json (max Paddle surf 98/193); filter panel hides Natación/Kayak/Snorkel/Pesca (2026-11-14)
- [2026-11-14] criterion 3 — evidence: NODE_ENV=development pnpm vitest run src/features/beaches/activities-grid.test.tsx src/lib/activities.test.ts → beach Actividades block drops unlisted activities and no listed activity is on every beach; pnpm build/test/check pass (2026-11-14)
- [2026-11-14] Completed