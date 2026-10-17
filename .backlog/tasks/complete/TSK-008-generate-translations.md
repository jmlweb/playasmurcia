---
id: TSK-008
title: Generate Translations
status: complete
priority: P3
tags: [data]
created: 2026-03-22
source: manual
depends-on: []
completed: 2026-03-27
---

# Generate Translations

## Description

As an international tourist, I want to read beach descriptions in my language (English, German, French) so that I can plan my visit without language barriers.

## Acceptance Criteria

- [ ] `translations` field added to schema (EN, DE, FR with name + description)
- [ ] Script `scripts/generate-translations.js` created using Ollama
- [ ] All 194 beaches have translations in 3 languages
- [ ] Translations are natural, not literal word-for-word
- [ ] Beach names appropriately translated or kept as-is
- [ ] Database schema and migration updated
- [ ] Frontend supports language switching (or at minimum, data is stored)

## Notes

Uses Ollama for translation (zero API cost).
Estimated time: ~2h (194 beaches x 3 languages).

Static translations are SEO-friendly vs Google Translate widgets.

Script is one-time enrichment (delete after use).

## Files to Modify

- `src/db/schema.ts` (add translations table or field)
- `scripts/generate-translations.js` (create, then delete)
- `data/beaches.json` (add translations)
- `src/routes/playas/$slug.tsx` (display translations)

## Dependencies

-

## Learnings

(None yet)

## Progress Log

(No progress yet)
- [2026-10-17] Migrated from legacy backlog/ (originally task #008)
