---
id: RPT-067
title: Small copy and accessibility defects on beach detail
type: bug
severity: low
status: triaged
created: 2026-11-04
triaged: 2026-11-04
task-id: TSK-166
---

## Summary

Several small defects affect spelling, tap targets and assistive-technology labels.

## Details

- `data/services.json:10`: "Rampa Accesible" should be "Rampa accesible".
- Contact links are 20px tall, under the 24px WCAG 2.5.8 minimum.
- Gallery alt text such as "Playa de El Rincón - foto 1" does not describe the scene.
- Leaflet controls expose English labels: "Marker", "Zoom in", "Zoom out".
- The hero breadcrumb looks weak over bright sand. This was not measured.

## Steps to Reproduce

1. Open `/playas/playa-de-el-rincon` at 375px.
2. Inspect Servicios, Contacto, the gallery and the map through the accessibility tree.

## Expected vs Actual

- Expected: correct Spanish casing, 24px targets, descriptive alt text and Spanish labels.
- Actual: the defects listed above.

## Error messages/logs

None.
