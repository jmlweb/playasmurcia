# Task #054: Replace `<a>` with `<Link>` for Client-Side Navigation

## Metadata
- **Status**: pending
- **Priority**: P2 - High
- **Slice**: Infra
- **Created**: 2026-03-29
- **Started**: -
- **Blocked by**: -

## User Story

As a visitor, I want page transitions to be instant without full reloads so that the site feels fast and responsive.

## Context

Code quality audit (2026-03-29) found dozens of plain `<a>` tags where TanStack Router `<Link>` should be used. This causes full page reloads, losing client-side navigation, scroll state, and prefetching.

Affected files:
- `src/routes/__root.tsx:206, 232` (NavDropdown municipality and characteristic links)
- `src/routes/__root.tsx:311, 329` (MobileDropdown links)
- `src/routes/colecciones/index.tsx:83, 132` (CollectionCard, SeaCollectionCard)
- `src/routes/municipios/index.tsx:97` (MunicipalityCard)
- `src/routes/colecciones/$slug.tsx:176` (back link)
- `src/routes/municipios/$slug.tsx:178` (back link)
- `src/routes/index.tsx:199` (municipality tiles)

## Acceptance Criteria

- [ ] All internal navigation links use `<Link>` from `@tanstack/react-router`
- [ ] No plain `<a>` tags for internal routes remain (external links are fine)
- [ ] Page transitions work without full reload
- [ ] Existing tests pass

## Notes

Report: `reports/done/code-quality-audit.md` (item 5).
