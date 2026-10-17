---
id: TSK-114
title: Fix: add security headers to production responses
status: active
priority: P3
tags: []
created: 2026-10-17
source: report/RPT-044
depends-on: []
started: 2026-10-17
---

# Fix: add security headers to production responses

## Description

Responses from `https://www.playasmurcia.com/` carry none of: `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options`/CSP `frame-ancestors`, `Content-Security-Policy`, `Referrer-Policy`.

Note: a `public/_headers` file applies only to static assets served by the assets binding, not to SSR Worker responses. Decide where to set them (Cloudflare Transform Rule or the server entry) and verify on HTML. Start with a report-only CSP. Enable HSTS after TSK-113 (HTTPS redirect).

Report: .backlog/reports/complete/RPT-044-no-security-headers-on-production.md

## Acceptance Criteria

- [ ] / returns Strict-Transport-Security, X-Content-Type-Options: nosniff, a framing restriction and Referrer-Policy
- [x] CSP deployed in report-only mode allowing Open-Meteo, img.playasmurcia.com and map tile origins
- [ ] Headers verified on both SSR HTML and static assets
- [ ] HSTS enabled only after TSK-113 is live

## Notes

## Learnings

## Progress Log

- [2026-10-17] Created
- [2026-10-17] src/server.ts + security-headers.ts (report-only CSP) and public/_headers for assets; verified locally on SSR and static. HSTS is sent on HTTPS only. Production check pending deploy.
- [2026-10-17] Started