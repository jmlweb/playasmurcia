---
id: RPT-044
title: No security headers on production responses
type: security
severity: medium
status: pending
created: 2026-10-17
---

- **Found**: 2026-10-17, against https://www.playasmurcia.com/
- **Area**: Worker response headers (`src/` server entry / Cloudflare rules)

## Observed

The response headers of `/` contain none of: `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options` / CSP `frame-ancestors`, `Content-Security-Policy`, `Referrer-Policy`.

## Expected

At least HSTS, `nosniff`, a framing restriction and a referrer policy. A CSP is desirable once third-party origins (Open-Meteo, `img.playasmurcia.com`, map tiles) are listed.

## Repro

```bash
curl -sI https://www.playasmurcia.com/ | grep -iE 'strict-transport|x-content-type|x-frame|content-security|referrer-policy'
# no output
```

## Suggested fix

Add the headers through a Cloudflare Transform Rule or a `public/_headers` file (check that the Worker setup honours it). Start with a report-only CSP.

## Impact

Clickjacking and downgrade exposure. Low effort to fix.