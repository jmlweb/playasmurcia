---
id: TSK-151
title: Municipality income and tourist housing from INE
status: complete
priority: P4
tags: [data, external-source, municipalities]
created: 2026-11-04
source: manual
depends-on: [TSK-148]
started: 2026-11-08
completed: 2026-11-08
---

# Municipality income and tourist housing from INE

## Description

Add two INE series to the municipality facts block from TSK-148. The values have not been pulled yet.

Income: Atlas de Distribución de Renta de los Hogares, 2024 data, net income per person. From the 2023 edition it is based on declared income, so it is not directly comparable with earlier editions.

Tourist housing: INE experimental statistics give homes, beds and share of housing stock by municipality. Secondary sources disagree on whether it is published twice a year or quarterly.

Sources: https://ine.es/dyngs/Prensa/ADRH2024.htm and https://www.ine.es/prensa/experimental_viv_turistica.pdf

## Acceptance Criteria

- [x] ADRH 2024 income per person stored for all 8 municipalities, noting the series break before the 2023 edition — evidence: data/municipality-facts.json income block, 8 values, year 2024 (ADRH 2024 published 2026-10-19); INE says the 2023 break is the population source (Censo Anual), not declared income; caveat shown on the page (2026-11-08)
- [x] Tourist homes and beds stored with their reference period — evidence: touristHousing block: homes, beds, sharePercent per municipality, period mayo de 2026 (2026-11-08)
- [x] Release frequency confirmed from INE — evidence: INE page: dos veces al año, mayo y noviembre (quoted in releaseFrequency) (2026-11-08)
- [x] Shown on the municipality page with sources cited — evidence: MunicipalityFactsPanel renders both with INE links; Playwright on /municipios/san-javier; tests pass (2026-11-08)

## Notes

## Learnings

## Progress Log

- [2026-11-04] Created
- [2026-11-08] Started
- [2026-11-08] Values pulled via INE JSON API tables 31115, 39363, 39366 (URLs stored in the JSON).
- [2026-11-08] Completed