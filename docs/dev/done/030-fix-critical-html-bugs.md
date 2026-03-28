# Task #030: Fix Critical HTML and Rendering Bugs

## Metadata
- **Status**: completed
- **Priority**: P1 - Active
- **Slice**: Styling
- **Created**: 2026-03-28
- **Started**: 2026-03-28
- **Completed**: 2026-03-28
- **Blocked by**: -

## User Story

As a visitor, I want the site to render correctly without broken text, invalid HTML, or conflicting styles.

## Context

UI review (2026-03-28) found three critical rendering issues affecting multiple pages. See `docs/dev/ui-review/cross-cutting.md` and `docs/dev/ui-review/municipios-index.md` for full directives.

## Acceptance Criteria

- [x] Fix nested `<main>` elements: root layout and page components both render `<main>`. Remove `<main>` from `__root.tsx` or from each page component so there is exactly one `<main>` per page
- [x] Fix service icons rendering as text IDs ("sunbeds", "parking", etc.) on municipality cards — ensure `service.icon` contains actual emoji/visual icons, not string identifiers
- [x] Fix active nav link class collision: `className` and `activeProps.className` apply conflicting Tailwind color utilities simultaneously. Ensure only one set of classes applies per state
- [x] Verify fixes across all affected pages: homepage, municipios index, all nav links

## Progress Log

- [2026-03-28] Started task
- [2026-03-28] All three bugs fixed and verified (nested main, icon emoji, nav classes)
- [2026-03-28] Task completed — all 140 tests passing

## Notes

- The nested `<main>` issue is an accessibility violation (WCAG landmark model)
- The icon text ID issue may be a data problem (services table) or a missing mapping in the component
- The nav class collision may need TanStack Router's `inactiveProps` pattern instead of overlapping className
