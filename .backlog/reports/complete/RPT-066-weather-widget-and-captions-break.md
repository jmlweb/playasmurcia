---
id: RPT-066
title: Weather widget and captions break icon and contrast rules
type: bug
severity: low
status: triaged
created: 2026-11-04
triaged: 2026-11-04
task-id: TSK-165
---

## Summary

The beach detail page breaks the Icons Policy, the palette rules and the caption contrast floor.

## Details

- `weather-widget.tsx:428` renders `%💧`, using emoji as a functional icon.
- That text is 10.4px and uses an off-palette `blue-*` colour.
- `gray-400` at 12px is used for "Fuente: Open-Meteo" and práctica labels (`practical-info-card.tsx:40`, `:218`).
- `gray-500` at 12px is used for forecast days, coordinates and nearby card meta. The floor is `gray-500` at 14px or `gray-600` at 13px.

Colours were judged from tokens and sizes, not measured.

## Steps to Reproduce

1. Open `/playas/playa-de-el-rincon`.
2. Review the forecast cards, práctica labels and nearby cards.

## Expected vs Actual

- Expected: SVG icons, palette colours and captions at or above the floor.
- Actual: emoji, off-palette blue and captions below the floor.

## Error messages/logs

None.
