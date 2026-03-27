# Task #019: Enrich SEO Keywords and Meta Descriptions

## Metadata
- **Status**: pending
- **Priority**: P2 - Next
- **Slice**: Content
- **Created**: 2026-03-27
- **Started**: -
- **Blocked by**: -

## User Story

As a site owner, I want optimized SEO metadata for every beach page so that they rank well for relevant long-tail searches.

## Context

Content audit (2026-03-27) found:
- All `metaDescription` are now unique and ≤160 chars (fixed during audit)
- `seoKeywords` exist for all 194 beaches but may contain duplicates or miss long-tail opportunities
- `instagramHashtag` coherence with beach names not fully verified

## Acceptance Criteria

- [ ] Audit `seoKeywords` for duplicates within each beach entry
- [ ] Add long-tail keywords relevant to each beach (e.g., "calas escondidas Cartagena", "playas para niños Mazarrón")
- [ ] Verify `instagramHashtag` matches beach name (no typos, consistent format)
- [ ] Ensure `metaDescription` includes municipality name and a differentiating characteristic
- [ ] No two beaches share identical `seoKeywords` arrays

## Notes

- Can be automated with a script using existing beach data to generate relevant long-tail keywords
- Focus on search terms tourists actually use: "mejores playas murcia", "playas tranquilas", "calas secretas"
