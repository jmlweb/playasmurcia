# Task #021: Research and Add Missing Contact Information

## Metadata
- **Status**: pending
- **Priority**: P3
- **Slice**: Data
- **Created**: 2026-03-27
- **Started**: -
- **Blocked by**: -

## User Story

As a visitor, I want contact information and official URLs for beaches so that I can get up-to-date info from official sources.

## Context

Content audit (2026-03-27) found only 8% of beaches have phone, email, or `realUrl`. The `ContactInfo` component renders empty for 92% of beaches.

## Acceptance Criteria

- [ ] Research official beach pages from municipality tourism portals
- [ ] Populate `realUrl` for beaches that have official pages
- [ ] Add `phone` and `email` for beaches with tourist offices or info points
- [ ] Hide `ContactInfo` component when all fields are empty (avoid empty sections)
- [ ] Document sources for each piece of contact data

## Skip Reason

Skipped by Ralph Loop (2026-03-27): Requires manual research to find and verify contact info from municipality tourism portals and official sources. ContactInfo component already hides when empty (line 9-13 in contact-info.tsx).

## Notes

- Main sources: ayuntamientos, CARM turismo, Costas del Estado
- Only add verified, current contact info — never fabricate
- Consider hiding the contact section entirely when empty rather than showing blank space
