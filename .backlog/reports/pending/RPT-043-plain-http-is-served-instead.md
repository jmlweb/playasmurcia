---
id: RPT-043
title: Plain HTTP is served instead of redirecting to HTTPS
type: finding
severity: medium
status: pending
created: 2026-10-17
---

- **Found**: 2026-10-17, against http://www.playasmurcia.com
- **Area**: Cloudflare zone settings / `wrangler.jsonc`

## Observed

`curl -I http://www.playasmurcia.com/` returns `HTTP/1.1 200 OK` with no `Location` header. The apex over HTTPS correctly 301s to `https://www.playasmurcia.com/`.

## Expected

HTTP requests 301 to HTTPS.

## Repro

```bash
curl -sI http://www.playasmurcia.com/ | head -3
```

## Suggested fix

In Cloudflare, enable "Always Use HTTPS" for the zone (or a redirect rule). Pair it with HSTS (see QA-5).

## Impact

Users who type or follow an `http://` link browse unencrypted. Search engines may index duplicate HTTP URLs, and the site has no canonical tags yet (see backlog #109).