---
id: TSK-113
title: Fix: redirect plain HTTP to HTTPS
status: active
priority: P3
tags: []
created: 2026-10-17
source: report/RPT-043
depends-on: []
started: 2026-10-17
---

# Fix: redirect plain HTTP to HTTPS

## Description

`curl -I http://www.playasmurcia.com/` returns `200 OK` with no `Location`. The apex over HTTPS correctly 301s to www.

Fix: enable "Always Use HTTPS" for the Cloudflare zone (or add a redirect rule). Pair with HSTS (RPT-044). Related: canonical tags (TSK-109), since duplicate HTTP URLs may be indexed.

Report: .backlog/reports/complete/RPT-043-plain-http-is-served-instead.md

## Acceptance Criteria

- [ ] curl -sI http://www.playasmurcia.com/ returns 301 with Location https://www.playasmurcia.com/
- [ ] curl -sI http://playasmurcia.com/ redirects to HTTPS
- [ ] Setting documented in docs/development.md

## Notes

## Learnings

## Progress Log

- [2026-10-17] Created
- [2026-10-17] Set Cloudflare zone always_use_https=on via API. curl verification pending (blocked in this session).
- [2026-10-17] Started