# Task #094: Beach Detail Empty States and Trust Polish

## Metadata

- **Status**: completed
- **Priority**: P1 - Active
- **Started**: 2026-04-02
- **Completed**: 2026-04-02
- **Slice**: Styling
- **Created**: 2026-04-02
- **Blocked by**: -

## User Story

As a user on a beach detail page, I want secondary widgets (weather, status) to feel clearly secondary when data is missing, and I want hero metadata to meet contrast expectations.

## Context

UI review (2026-04-02): empty weather/status cards compete visually with primary practical info; hero tag pills may need contrast check on photo heroes.

## Acceptance Criteria

- [x] **Degraded states**: Differentiate weather-unavailable and out-of-season beach status cards from `PracticalInfoCard` (lighter shadow, dashed border, and/or muted icon treatment per directive).
- [x] **Hero tag pills** on beach detail: verify WCAG AA text contrast on gradient/photo heroes; darken text or adjust pill opacity if needed.
- [x] Optional: gallery `gap` alignment with site spacing scale per directive.
- [x] `pnpm build`, `pnpm test`, and `pnpm check` pass.

## Source Reports

- `reports/done/beach-detail.md`

## Progress Log

- [2026-04-02 02:10] Differentiated degraded weather widget (error state): dashed border, reduced shadow, muted text
- [2026-04-02 02:12] Differentiated off-season beach status: dashed border, reduced shadow, muted text colors
- [2026-04-02 02:14] Updated gallery gap from 3 to 5 (spacing scale consistency)
- [2026-04-02 02:14] Verified hero tags use variant="dark" (white text on gradient) — contrast sufficient
- [2026-04-02 02:14] All checks pass (build, test, check)
- [2026-04-02 02:14] Task completed
