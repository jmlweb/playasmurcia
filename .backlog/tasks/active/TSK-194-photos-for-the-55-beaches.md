---
id: TSK-194
title: Photos for the 55 beaches that still have none
status: blocked
priority: P3
tags: [data, photos]
created: 2026-11-09
source: report/RPT-081
depends-on: []
started: 2026-11-20
blocked-by: Needs a human with R2 access and photo licences: public/pictures is empty in a fresh clone (originals live only in R2), so pnpm score:picture-quality has no files to score; pnpm sync:pictures needs R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY and rclone; non-Wikimedia sources (ITREM, municipal sites) need reuse permission obtained by a person; TSK-142 already used up Wikimedia Commons
---

# Photos for the 55 beaches that still have none

## Description

55 of 193 beaches (28%) have no picture and render the placeholder card; TSK-142 (Wikimedia pipeline) only gained two. Try other licence-compatible sources (ITREM sheets, municipal tourism sites with permission, Geograph, Flickr CC, own photos) following docs/photo-sourcing-guide.md. Source: .backlog/reports/complete/RPT-081-full-site-review-2026-11-09-findings.md.

## Acceptance Criteria

- [ ] Count of beaches without pictures reported before and after
- [ ] Only licence-compatible images, with credits in data/picture-credits.json
- [ ] pnpm score:picture-quality re-run and pictures synced to R2

## Notes

## Learnings

- LRN-052: Picture tasks need R2 originals and credentials, not a fresh clone
## Progress Log

- [2026-11-09] Created
- [2026-11-20] Started
- [2026-11-20] Before count: 55 of 193 beaches have no pictures (Cartagena 27, Águilas 14, Mazarrón 7, Lorca 3, San Javier 4) — jq over data/beaches.json (2026-11-20). No after count: no pictures were added
- [2026-11-20] Blocked: Needs a human with R2 access and photo licences: public/pictures is empty in a fresh clone (originals live only in R2), so pnpm score:picture-quality has no files to score; pnpm sync:pictures needs R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY and rclone; non-Wikimedia sources (ITREM, municipal sites) need reuse permission obtained by a person; TSK-142 already used up Wikimedia Commons