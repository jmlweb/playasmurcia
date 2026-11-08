---
id: LRN-046
title: Beach points sit on the waterline: intersect protected areas with a 50 m tolerance and drop sea sites
status: active
tags: [data, geo]
task: TSK-140
created: 2026-11-08
---

Exact point-in-polygon between `beaches.json` `coordinates` and the CARM protected-area limits misses many beaches by 1–45 m. Park limits often follow the shoreline, and the beach point lies on or just past the waterline (Cala Salitrona 1 m, Las Pulgas 2 m, Torre Derribada 4 m outside). A 50 m tolerance brings them in without pulling in parks 100 m or more away.

The opposite happens with sites drawn over water: the submerged coastal strip ZEC, the Mar Menor ZEC and ZEPA, and the marine ZEPAs. They touch every beach on their shore, so whether a beach "belongs" depends only on which side of the waterline its point fell on. Exclude them by code and say so in the data file (`excludedMarineSites`).
