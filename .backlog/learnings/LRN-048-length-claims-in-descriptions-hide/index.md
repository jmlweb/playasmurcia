---
id: LRN-048
title: Length claims in descriptions hide behind km rounding; match near the OSM figure, compare as the page rounds
status: active
tags: [content, data, validation]
task: TSK-192
created: 2026-11-11
---

The task counted 65 descriptions by matching the literal OSM length integer in the text. A broader scan found 79: the 65 literal matches plus 14 that round the OSM figure ("algo más de 1,2 kilómetros", "casi 1,75 kilómetros", "unos 900 metros"). A literal-number match misses rounded and near-equal figures.

The page prints lengths through formatBeachLength: exact metres below 1 km, kilometres rounded to 0.1 from 1 km on. A prose check therefore has to compare km figures after rounding, not exact metres.

Descriptions also mention distances ("a unos 4 kilómetros por la carretera", "unos 700 metros a pie") and road markers ("kilómetro 8,5"). The validator only flags figures within 15% of the OSM length, which skips distances. The regex needs the number before the unit, which skips road markers.
