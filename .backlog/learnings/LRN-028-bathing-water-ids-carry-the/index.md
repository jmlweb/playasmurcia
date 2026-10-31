---
id: LRN-028
title: Bathing water IDs carry the NUTS region: ES620 is Murcia
status: active
tags: [data, external-source, eea]
task: TSK-133
created: 2026-10-31
---

EEA bathingWaterIdentifier starts with the NUTS-2 code of the reporting region: ES620 = Región de Murcia, ES521 = Alicante (Comunitat Valenciana), ES611 = Almería (Andalucía). A bounding box around the Murcia coast pulls in Alicante (Pilar de la Horadada, Mil Palmeras) and Almería (Pozo del Esparto) points, so filter by the ES620 prefix before matching beaches by distance. Nearest-point distances from beach coordinates: 107 beaches within 500 m, 137 within 1 km; past about 600 m the nearest point increasingly belongs to a different beach (Playa Negra -> El Alamillo at 656 m), while some correct matches sit just over 500 m (Los Nietos 544 m).
