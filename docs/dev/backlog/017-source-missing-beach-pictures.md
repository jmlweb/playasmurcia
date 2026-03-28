# Task #017: Source Missing Beach Pictures

## Metadata
- **Status**: pending
- **Priority**: P4 - Later
- **Slice**: Content
- **Created**: 2026-03-27
- **Started**: 2026-03-28
- **Blocked by**: -

## User Story

As a visitor, I want to see photos of every beach so that I can visually evaluate them before planning my visit.

## Context

Content audit (2026-03-27) identified 79 of 194 beaches (41%) have no pictures. Worst coverage: Cartagena (30), Águilas (17), Mazarrón (14), Lorca (11).

See municipality counts in [`docs/dev/content-audit.md`](../content-audit.md#1-beaches-missing-pictures-79) §1.

## Acceptance Criteria

- [ ] Identify free/open-license photo sources (Wikimedia Commons, Flickr CC, regional tourism portals)
- [ ] Source at least 1 photo per beach for the 79 missing
- [ ] Optimize images (WebP, max 1200px wide, <200KB)
- [ ] Add to `pictures` array in `data/beaches.json`
- [ ] Update `content-audit.md` with new coverage stats

## Skip Reason

Skipped by Ralph Loop (2026-03-27): Requires manual research to source, verify licenses, and download photos from external sources. Cannot be automated without human curation.

## Notes

- Prioritize municipalities with worst coverage: Cartagena, Águilas, Mazarrón, Lorca
- Verify license compatibility before using any photo
- Consider using a script to batch-download and optimize from approved sources

## Progress Log

- [2026-03-28 11:00] Started task: Building Wikimedia Commons search + semi-automated workflow
