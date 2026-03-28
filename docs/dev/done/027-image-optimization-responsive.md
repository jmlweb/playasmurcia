# Task #027: Image Optimization and Responsive Variants

## Metadata
- **Status**: done
- **Priority**: P1 - Critical
- **Slice**: Full-stack
- **Created**: 2026-03-28
- **Started**: 2026-03-28
- **Completed**: 2026-03-28
- **Blocked by**: -

## User Story

As a visitor, I want beach photos to load quickly in the right size for my device so that pages feel fast and images look sharp without wasting bandwidth.

## Context

Gap analysis (`docs/github-main-feature-gap-analysis.md`, section 3) identified that v3 serves raw static images from `public/pictures/` with plain `<img>` tags — no CDN transformations, no responsive `srcset`, no format optimization. The production site uses Cloudinary + `next/image` for automatic format, quality, and responsive variants.

Prior exploration in `docs/unpic-use-cases.md` evaluated unpic as a lightweight solution.

## Acceptance Criteria

- [ ] Beach card thumbnails use responsive `srcset` with at least 2 size variants (e.g., 400w, 800w)
- [ ] Beach detail photo gallery uses responsive images with appropriate sizes
- [ ] Images served in modern format (WebP/AVIF) via CDN transformation or build-time optimization
- [ ] `sizes` attribute set correctly for each context (card grid vs full-width gallery)
- [ ] Lazy loading (`loading="lazy"`) on below-fold images; eager on first visible card/hero
- [ ] Lighthouse image audit: no "properly size images" or "serve in next-gen format" warnings
- [ ] Build passes, no visual regressions

## Technical Notes

- Evaluate: Cloudflare Images (native to the platform) vs unpic (framework-agnostic, already explored)
- If using Cloudflare Images: requires uploading images or using URL-based transformations
- If using unpic: wraps existing URLs with responsive props, minimal migration
- Key components to update: `BeachCard` (`src/components/beach-card.tsx`), `PhotoGallery` (`src/components/photo-gallery.tsx`)

## Vertical Slice

**End-to-end image delivery**: From storage/CDN through responsive markup to the browser. Touches image components + potentially build/deploy config. No data model changes.
