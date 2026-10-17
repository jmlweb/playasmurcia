---
id: TSK-032
title: Add Reduced Motion Support
status: complete
priority: P2
tags: [styling]
created: 2026-03-28
source: manual
depends-on: []
completed: 2026-03-28
---

# Add Reduced Motion Support

## Description

As a visitor with motion sensitivity, I want animations to be disabled when I've set `prefers-reduced-motion: reduce` in my OS settings.

## Acceptance Criteria

- [ ] Add `@media (prefers-reduced-motion: reduce)` rules in `src/styles.css` to disable `animate-fade-up`, `animate-slide-in-left`, and `animate-dropdown`
- [ ] Use `motion-safe:` prefix on hover transform classes (e.g., `motion-safe:hover:-translate-y-1`, `motion-safe:group-hover:scale-105`)
- [ ] Verify all pages render correctly with reduced motion enabled (no broken layouts from missing transforms)

## Context

UI review (2026-03-28) found no `prefers-reduced-motion` handling anywhere. Multiple animations run unconditionally: hero fade-up, filter panel slide-in, card hover transforms, image zoom on hover. See `.backlog/reports/complete/RPT-010-cross-cutting-design-directives-playasmurcia-ui.md` for full directive.

## Notes

- This is a WCAG 2.1 AA requirement (Success Criterion 2.3.3)
- Tailwind v4 supports `motion-safe:` and `motion-reduce:` variants natively
- Transforms should simply not apply under reduced motion — no need for alternative animations

## Learnings

## Progress Log

- [2026-10-17] Migrated from legacy backlog/ (originally task #032)
