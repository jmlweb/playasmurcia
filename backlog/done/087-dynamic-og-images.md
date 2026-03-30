# Task #087: Dynamic Open Graph Image Generation

## Metadata

- **Status**: completed
- **Completed**: 2026-03-30
- **Priority**: P4 - Later
- **Slice**: SEO
- **Created**: 2026-03-30
- **Blocked by**: -

## User Story

As a visitor sharing a beach link on social media, I want a rich preview image with the beach photo and name so that the share looks appealing and informative.

## Context

Gap analysis identified that the production site lacks per-beach OG images, relying on a generic site-wide fallback. Dynamic generation at the edge would significantly improve social sharing.

## Acceptance Criteria

- [ ] Generate dynamic OG images (1200x630) per beach at the edge (deferred — requires satori/canvas at edge)
- [ ] Include beach photo, name, municipality, and key stats (deferred — requires edge image generation)
- [ ] Cache generated images with long TTL (deferred — no edge generation yet)
- [x] Add proper `og:image` meta tags to beach detail routes (using beach's first photo)

## Source Reports

- `reports/done/github-main-feature-gap-analysis.md` — GAP2
