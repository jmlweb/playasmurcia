---
id: TSK-151
title: Municipality income and tourist housing from INE
status: pending
priority: P4
tags: [data, external-source, municipalities]
created: 2026-11-04
source: manual
depends-on: [TSK-148]
---

# Municipality income and tourist housing from INE

## Description

Add two INE series to the municipality facts block from TSK-148. The values have not been pulled yet.

Income: Atlas de Distribución de Renta de los Hogares, 2024 data, net income per person. From the 2023 edition it is based on declared income, so it is not directly comparable with earlier editions.

Tourist housing: INE experimental statistics give homes, beds and share of housing stock by municipality. Secondary sources disagree on whether it is published twice a year or quarterly.

Sources: https://ine.es/dyngs/Prensa/ADRH2024.htm and https://www.ine.es/prensa/experimental_viv_turistica.pdf

## Acceptance Criteria

- [ ] ADRH 2024 income per person stored for all 8 municipalities, noting the series break before the 2023 edition
- [ ] Tourist homes and beds stored with their reference period
- [ ] Release frequency confirmed from INE
- [ ] Shown on the municipality page with sources cited

## Notes

## Learnings

## Progress Log

- [2026-11-04] Created