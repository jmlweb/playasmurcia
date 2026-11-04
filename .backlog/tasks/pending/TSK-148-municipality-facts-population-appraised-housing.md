---
id: TSK-148
title: Municipality facts: population, appraised housing value, tourist offices
status: pending
priority: P3
tags: [data, external-source, municipalities]
created: 2026-11-04
source: manual
depends-on: []
---

# Municipality facts: population, appraised housing value, tourist offices

## Description

Municipality pages show only the beach and Blue Flag counts. Add official facts.

Population: INE municipal table 2883 (2025 values: Cartagena 220,704; Lorca 98,969; Águilas 37,811; San Javier 36,524; Mazarrón 35,449; San Pedro del Pinatar 29,674; La Unión 21,380; Los Alcázares 20,408).

Housing: no official median was found. Use the ministry's mean appraised value of free-market housing, published by CREM in €/m². Use the "Total vivienda libre" block only, as the next block is the series for homes up to 5 years old. Q2 2026 values: San Javier 1,952.8; Mazarrón 1,583.6; Cartagena 1,485.6; Águilas 1,453.8; Lorca 1,170.2; regional average 1,350.1. San Pedro del Pinatar, La Unión and Los Alcázares do not appear in the table. Label it as a mean appraised value, not a median or sale price. It is municipality-wide, so Lorca's figure mostly reflects inland housing.

Penotariado is excluded: no documented API or reuse terms were found.

Tourist offices: `https://nexo.carm.es/nexo/archivos/recursos/opendata/json/OficinasdeTurismo.json` (22 entries across our municipalities, with "La Manga" as its own municipality value; last updated Feb 2024).

Sources: https://servicios.ine.es/wstempus/js/ES/DATOS_TABLA/2883?tip=AM&nult=1 and https://econet.carm.es/inicio/-/crem/sicrem/PU_datosBasicos/pdf/sec71.pdf

## Acceptance Criteria

- [ ] INE population stored with its reference year for all 8 municipalities
- [ ] Mean appraised value stored with its quarter for Águilas, Cartagena, Lorca, Mazarrón and San Javier
- [ ] Municipalities without a figure show nothing rather than an estimate
- [ ] Tourist offices re-verified against current official pages, since the dataset dates from Feb 2024
- [ ] Facts shown on the municipality page with sources cited

## Notes

## Learnings

## Progress Log

- [2026-11-04] Created