---
id: TSK-178
title: Measure explorer filter latency on a production build
status: pending
priority: P4
tags: [performance, explorer]
created: 2026-11-07
source: report/RPT-078
depends-on: []
---

# Measure explorer filter latency on a production build

## Description

Filter changes on `/explorar` caused long tasks of 233-274 ms in a dev build at CPU 4x, and removing the hidden sidebar copy did not help noticeably. Production performance was never measured. The report says its fixes were uncommitted, but they shipped in ab42d05. See `.backlog/reports/complete/RPT-078-impeccable-audit-of-the-explorer.md`.

## Acceptance Criteria

- [ ] Filter long tasks measured on a production build at CPU 4x
- [ ] Result recorded in the task
- [ ] If interaction stays above 200 ms, the cause is identified and a follow-up task is filed

## Notes

## Learnings

## Progress Log

- [2026-11-07] Created