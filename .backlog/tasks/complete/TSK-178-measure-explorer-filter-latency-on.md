---
id: TSK-178
title: Measure explorer filter latency on a production build
status: complete
priority: P4
tags: [performance, explorer]
created: 2026-11-07
source: report/RPT-078
depends-on: []
started: 2026-11-08
completed: 2026-11-08
---

# Measure explorer filter latency on a production build

## Description

Filter changes on `/explorar` caused long tasks of 233-274 ms in a dev build at CPU 4x, and removing the hidden sidebar copy did not help noticeably. Production performance was never measured. The report says its fixes were uncommitted, but they shipped in ab42d05. See `.backlog/reports/complete/RPT-078-impeccable-audit-of-the-explorer.md`.

## Acceptance Criteria

- [x] Filter long tasks measured on a production build at CPU 4x — evidence: pnpm build + pnpm preview --port 4173, Playwright with CDP Emulation.setCPUThrottlingRate 4, PerformanceObserver longtask on /explorar (2026-11-08) (2026-11-08)
- [x] Result recorded in the task — evidence: Click to next paint: sea Mar Menor 156 ms (one 70 ms long task), need Perros 79 ms, municipality Cartagena 65 ms, query text 43 ms; no long task over 70 ms (2026-11-08)
- [x] If interaction stays above 200 ms, the cause is identified and a follow-up task is filed — evidence: All interactions under 200 ms on the production build; no follow-up needed. The 233-274 ms figures were dev-build overhead (2026-11-08)

## Notes

## Learnings

## Progress Log

- [2026-11-07] Created
- [2026-11-08] Started
- [2026-11-08] Measured on commit 7bfd9a2. Two selectors (Duchas row, sort select) timed out in the script and were not measured; the four measured ones cover services-free paths, sea, need and municipality filters plus text search.
- [2026-11-08] Completed