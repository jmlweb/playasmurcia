---
id: TSK-003
title: Deploy to Production
status: complete
priority: P2
tags: [infra]
created: 2026-03-22
source: manual
depends-on: [TSK-002]
started: 2026-03-27
completed: 2026-03-27
---

# Deploy to Production

## Description

As a developer, I want to deploy the v3 branch to production so that users can access the site with database-backed data.

## Acceptance Criteria

- [x] Production build completes without errors (`pnpm build`)
- [x] Site deployed and accessible at production URL
- [x] Beach pages load data from Turso (not JSON fallback)
- [x] Sitemap accessible at /sitemap.xml
- [x] No console errors in production

## Notes

1. Merge v3 into main (or deploy from v3)
2. Build: `pnpm build`
3. Deploy to hosting platform
4. Verify routes work with database queries
5. JSON fallback (`src/lib/data.ts`) remains as safety net

## Files to Modify

- Deployment config (hosting-specific)

## Dependencies

- #002 (Production env vars configured)

## Learnings

(None yet)

## Progress Log

- [2026-03-27] Deployed to Cloudflare Workers via `wrangler deploy`
- [2026-03-27] Task completed
- [2026-10-17] Migrated from legacy backlog/ (originally task #003)
