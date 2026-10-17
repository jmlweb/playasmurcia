---
id: TSK-082
title: Image Pipeline Optimization
status: complete
priority: P3
tags: [performance]
created: 2026-03-30
source: manual
depends-on: []
completed: 2026-03-30
---

# Image Pipeline Optimization

## Description

As a visitor, I want images to load fast in modern formats so that pages feel snappy and data usage is minimal.

## Acceptance Criteria

- [x] Add AVIF output format to `optimize-images.ts` (20–30% better than WebP)
- [x] Generate 3 size variants: thumb (400px), medium (800px), full (1200px)
- [x] Update `ResponsiveImage` component to include AVIF `<source>` before WebP + all 3 size variants
- [x] Set `Cache-Control: public, max-age=31536000, immutable` for `/pictures/` routes
- [x] Verify CI runs `optimize:images` before build so optimized images reach deploy

## Context

Anti-scraping/image architecture report and gap analysis identified missing AVIF support, no size variants for different contexts, and no immutable cache headers for images.

## Source Reports

- `.backlog/reports/complete/RPT-001-anti-scraping-protection-image-serving-architecture.md` — IMG1–IMG5
- `.backlog/reports/complete/RPT-013-product-parity-and-feature-status.md` — GAP1

## Notes

## Learnings

## Progress Log

- [2026-10-17] Migrated from legacy backlog/ (originally task #082)
