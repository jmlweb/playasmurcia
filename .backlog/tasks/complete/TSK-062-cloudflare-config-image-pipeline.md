---
id: TSK-062
title: Cloudflare Config & Image Pipeline Hardening
status: complete
priority: P2
tags: [infra]
created: 2026-03-29
source: manual
depends-on: []
completed: 2026-03-29
---

# Cloudflare Config & Image Pipeline Hardening

## Description

As a site owner, I want edge-level bot blocking and an optimized image pipeline so that scraper traffic is stopped before consuming bandwidth and images are served in modern formats.

## Acceptance Criteria

### Cloudflare Dashboard (manual)

- [ ] Bot Fight Mode enabled (Security > Bots) — **manual, do in Cloudflare dashboard**
- [ ] WAF custom rule created to block known AI scraper user-agents — **manual**
- [ ] Hotlink Protection enabled (Scrape Shield) — **manual**

### Image Pipeline (code)

- [x] AVIF output added to `optimize-images.ts` alongside WebP
- [x] 1200px "full" variant added for detail pages
- [x] `ResponsiveImage` updated with AVIF `<source>` before WebP
- [x] Verify CI/build includes optimized images in deploy output
- [x] `Cache-Control: public, max-age=31536000, immutable` set for `/pictures/` via `_headers`

## Context

Complements **#061** (code changes). This task covers Cloudflare dashboard configuration and image pipeline improvements. Cloudflare's zero-egress model makes scraper bandwidth free, but WAF rules stop them at the edge entirely.

## Notes

Report: `.backlog/reports/complete/RPT-001-anti-scraping-protection-image-serving-architecture.md` (Layers 3-5, Phase 2).

## Learnings

## Progress Log

- [2026-10-17] Migrated from legacy backlog/ (originally task #062)
