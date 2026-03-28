# Task #040: Replace Emoji Icons with SVG Icons

## Metadata
- **Status**: pending
- **Priority**: P2 - Next
- **Slice**: Styling
- **Created**: 2026-03-28
- **Started**: -
- **Blocked by**: -

## User Story

As a visitor on any device, I want icons to render consistently so the site looks professional regardless of my OS or browser.

## Context

UI review (2026-03-28) found emoji used as functional icons across multiple pages. Emoji rendering varies dramatically between macOS, Windows, Android, and Linux. ZWJ sequences (family emoji) fail on older devices. See `docs/dev/ui-review/processed/cross-cutting.md` (CC-1).

## Acceptance Criteria

- [ ] Create SVG icon components in `src/components/icons/` using `currentColor` for fill/stroke
- [ ] Replace weather emoji in `BeachCard` (6 icons: sunny, partly-cloudy, cloudy, rain, storm, fog)
- [ ] Replace service emoji in `MunicipalityCard` on `/municipios` (top 15 services)
- [ ] Replace collection theme emoji in `ColeccionesPage` (12 themed icons)
- [ ] Replace activity emoji if present in beach detail
- [ ] All icons render at consistent sizes (20x20 or 24x24) across platforms
- [ ] Icons respect parent text color via `currentColor`

## Notes

- ~30-40 SVG icons total. Consider using a single icon sprite or individual components.
- See `docs/dev/ui-review/processed/municipios-index.md`, `docs/dev/ui-review/processed/colecciones-index.md` for detailed directives
