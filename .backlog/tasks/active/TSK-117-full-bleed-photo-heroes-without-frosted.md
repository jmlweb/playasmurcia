---
id: TSK-117
title: Full-bleed photo heroes without frosted panel
status: active
priority: P2
tags: [styling, frontend]
created: 2026-10-18
source: RPT-047
depends-on: []
started: 2026-10-19
---

# Full-bleed photo heroes without frosted panel

## Description

### Description

Every listing page and the homepage place a dark frosted panel over the hero photo, hiding most of the image (about 90% on mobile). This is the main source of the template feel. Replace the panel with a full-bleed photo and a gradient scrim, and unify breadcrumb placement.

See .backlog/reports/complete/RPT-047-ui-review-2026-10-19-cross-cutting-findings.md (Critical: hero; Important: breadcrumb, eyebrow contrast) for the full directive.

## Acceptance Criteria

- [ ] page-hero.tsx and hero-section.tsx no longer render the centered glass/backdrop-blur panel
- [ ] Photo is full-bleed with a bottom-weighted scrim (transparent to ocean-950 ~75% over bottom 60%)
- [ ] Title block left-aligned to the max-w-7xl container, bottom-left, 48px desktop / 24px mobile padding
- [ ] Hero height min(72vh, 640px) on home and ~420px on listing pages
- [ ] Eyebrow text reaches >= 4.5:1 contrast on every hero (coral-300 or white/80)
- [ ] Breadcrumb placement unified across all routes (inside hero above eyebrow, or directly below with 24px top padding); no ~90px gap
- [ ] Visual check with scripts/screenshot.ts on /, /municipios, /municipios/cartagena, /colecciones, /colecciones/bandera-azul, /explorar (desktop + --mobile)
- [ ] pnpm build, pnpm test and pnpm check pass

## Notes

## Learnings

- LRN-011: Undefined Tailwind color step fails silently
- LRN-012: Run oxfmt after oxlint --fix
- LRN-013: Fresh worktrees need setup before build, test and screenshots
## Progress Log

- [2026-10-18] Created
- [2026-10-19] Started