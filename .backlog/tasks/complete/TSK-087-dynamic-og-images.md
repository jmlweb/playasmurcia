---
id: TSK-087
title: Dynamic Open Graph Image Generation
status: complete
priority: P4
tags: [seo]
created: 2026-03-30
source: manual
depends-on: []
completed: 2026-03-30
---

# Dynamic Open Graph Image Generation

## Description

As a visitor sharing a beach link on social media, I want a rich preview image with the beach photo and name so that the share looks appealing and informative.

## Acceptance Criteria

- [ ] Generate dynamic OG images (1200x630) per beach at the edge (deferred — requires satori/canvas at edge)
- [ ] Include beach photo, name, municipality, and key stats (deferred — requires edge image generation)
- [ ] Cache generated images with long TTL (deferred — no edge generation yet)
- [x] Add proper `og:image` meta tags to beach detail routes (using beach's first photo)

## Context

Gap analysis identified that the production site lacks per-beach OG images, relying on a generic site-wide fallback. Dynamic generation at the edge would significantly improve social sharing.

## Source Reports

- `.backlog/reports/complete/RPT-013-product-parity-and-feature-status.md` — GAP2

## Notes

## Learnings

## Progress Log

- [2026-10-17] Migrated from legacy backlog/ (originally task #087)
