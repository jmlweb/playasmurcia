---
id: TSK-002
title: Configure Production Environment Variables
status: complete
priority: P2
tags: [infra]
created: 2026-03-22
source: manual
depends-on: [TSK-001]
started: 2026-03-27
completed: 2026-03-27
---

# Configure Production Environment Variables

## Description

As a developer, I want to configure production environment variables in the hosting platform so that the deployed app connects to Turso Cloud.

## Acceptance Criteria

- [x] TURSO_DATABASE_URL configured in hosting platform
- [x] TURSO_AUTH_TOKEN configured in hosting platform
- [x] Environment variables verified (test connection from production)

## Notes

Depends on hosting choice (Cloudflare Workers or Netlify):

Cloudflare:
```bash
wrangler secret put TURSO_DATABASE_URL
wrangler secret put TURSO_AUTH_TOKEN
```

Netlify:
```bash
netlify env:set TURSO_DATABASE_URL "libsql://..."
netlify env:set TURSO_AUTH_TOKEN "..."
```

## Files to Modify

- Hosting platform configuration (external)

## Dependencies

- #001 (Turso Cloud Setup)

## Learnings

(None yet)

## Progress Log

- [2026-03-27] Secrets configured via `wrangler secret put` for Cloudflare Workers
- [2026-03-27] Task completed
- [2026-10-17] Migrated from legacy backlog/ (originally task #002)
