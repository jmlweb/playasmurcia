---
id: RPT-032
title: UI Review — Beach detail (`/playas/cala-abierta`)
type: finding
severity: low
status: triaged
created: 2026-10-17
triaged: 2026-10-17
---

**Evidence:** `/tmp/ui-review-beach.png`, `/tmp/ui-review-beach-mobile.png`.

## Design Directive: Beach detail

### Critical (must fix)

- None.

### Important (should fix)

- None blocking.

### Refinement (nice to have)

- **Sidebar vs stack**: On desktop, weather + practical info sidebar is strong; on mobile the order (weather before long-form body) is correct for scanning. Keep spacing between cards consistent with `py`/`gap` tokens from guidelines.

### What works well

- **Hero**: Compact inner tier with municipality + tag pills matches heading-tier rules.
- **Map + coordinates + Google Maps link**: Clear utility block; mobile “tap to interact” pattern reduces accidental map scroll.
- **Services/activities pills**: Icon + label reads modern and consistent with guidelines.

**Severity summary:** Critical: 0, Important: 0, Refinement: 1