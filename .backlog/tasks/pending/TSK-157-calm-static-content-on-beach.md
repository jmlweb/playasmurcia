---
id: TSK-157
title: Calm static content on beach detail
status: pending
priority: P3
tags: [ui, beach-detail, design-system]
created: 2026-11-04
source: manual
depends-on: [TSK-153]
---

# Calm static content on beach detail

## Description

Servicios and Actividades chips resemble buttons but do nothing, and their blue and sand tints carry no meaning. Weather and Información práctica are shadowed cards, though `docs/ui-guidelines.md` says cards are for clickable items only. Use plain icon lists, and either unbox the sidebar or document it as an exception.

## Acceptance Criteria

- [ ] Servicios and Actividades no longer look like clickable buttons
- [ ] Blue and sand tints are removed unless they carry meaning
- [ ] A decision is recorded on whether Weather and Práctica stay as cards
- [ ] docs/ui-guidelines.md reflects that decision
- [ ] Layout verified at 375px and 1280px with scripts/screenshot.ts
- [ ] pnpm build, pnpm test and pnpm check pass

## Notes

## Learnings

## Progress Log

- [2026-11-04] Created
- [2026-11-04] Depends on TSK-153: restyle the layout after it is reordered.