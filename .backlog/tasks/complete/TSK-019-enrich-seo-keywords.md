---
id: TSK-019
title: Enrich SEO Keywords and Meta Descriptions
status: complete
priority: P2
tags: [content]
created: 2026-03-27
source: manual
depends-on: []
completed: 2026-03-27
---

# Enrich SEO Keywords and Meta Descriptions

## Description

As a site owner, I want optimized SEO metadata for every beach page so that they rank well for relevant long-tail searches.

## Acceptance Criteria

- [ ] Audit `seoKeywords` for duplicates within each beach entry
- [ ] Add long-tail keywords relevant to each beach (e.g., "calas escondidas Cartagena", "playas para niños Mazarrón")
- [ ] Verify `instagramHashtag` matches beach name (no typos, consistent format)
- [ ] Ensure `metaDescription` includes municipality name and a differentiating characteristic
- [ ] No two beaches share identical `seoKeywords` arrays

## Context

Content audit (2026-03-27) found:
- All `metaDescription` are now unique and ≤160 chars (fixed during audit)
- `seoKeywords` exist for all 194 beaches but may contain duplicates or miss long-tail opportunities
- `instagramHashtag` coherence with beach names not fully verified

## Notes

- Can be automated with a script using existing beach data to generate relevant long-tail keywords
- Focus on search terms tourists actually use: "mejores playas murcia", "playas tranquilas", "calas secretas"

## Learnings

## Progress Log

- [2026-10-17] Migrated from legacy backlog/ (originally task #019)
