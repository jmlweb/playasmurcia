# Task #079: Cross-Cutting UI Fixes

## Metadata

- **Status**: done
- **Completed**: 2026-03-30
- **Priority**: P2 - Should
- **Slice**: Accessibility
- **Created**: 2026-03-30
- **Blocked by**: -

## User Story

As a visitor, I want consistent UI quality across all pages so that the site feels polished and accessible everywhere.

## Context

Cross-cutting report and UI audit identified issues affecting multiple pages: 404 page accessibility, ServiceIcon rendering bugs, missing focus rings, and footer sizing.

## Acceptance Criteria

- [x] Fix 404 page contrast: `text-ocean-200` fails WCAG AA on `bg-sand-50` → change to `text-ocean-700`+
- [x] Fix ServiceIcon resolution: resolve by `service.id` first, use `service.icon` as deprecated fallback (raw tokens like "wheelchair" visible in UI)
- [x] Add `focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:ring-offset-2` to "Descubrir" Popover.Trigger
- [x] Add visible focus ring to dropdown panel Link items
- [x] Fix footer beach count badges from `text-[10px]` to `text-xs` minimum
- [x] Increase footer padding from `py-12` to `py-16`, add more vertical spacing

## Source Reports

- `reports/done/cross-cutting.md` — CC1–CC4
- `reports/done/ui-audit-2026-03-29.md` — FTR1, XC6
