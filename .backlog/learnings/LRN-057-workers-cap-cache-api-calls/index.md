---
id: LRN-057
title: Workers cap Cache API calls per request, so per-key cache fan-out breaks large batches
status: active
tags: [cache, weather, cloudflare]
task: TSK-196
created: 2026-11-26
---

Cloudflare Workers limits `caches.default` `match`/`put`/`delete` to 50 calls per request on Free and 1,000 on Paid, and these calls share the subrequest quota (https://developers.cloudflare.com/workers/platform/limits/, checked 2026-11-26). One edge-cache entry per coordinate would mean about 150 reads plus 150 writes for a full listing, which throws on Free. Card weather therefore keeps all coordinates in one record (`open-meteo-card-v4` / `readings`) with a `fetchedAt` per reading, so each caller applies its own TTL with a single read and at most one write. Use the same pattern for any batch that would otherwise cache many keys in one request.
