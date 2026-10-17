---
id: TSK-081
title: Anti-Scraping Protection
status: complete
priority: P3
tags: [infrastructure]
created: 2026-03-30
source: manual
depends-on: []
completed: 2026-03-30
---

# Anti-Scraping Protection

## Description

As the site owner, I want to block AI crawlers and hotlinking so that my content and images are protected from unauthorized scraping.

## Acceptance Criteria

- [x] Update `public/robots.txt` to block AI crawlers (GPTBot, CCBot, Bytespider, ClaudeBot, etc.) while allowing search engines
- [x] Add `<meta name="robots" content="noai, noimageai">` to site `<head>`
- [ ] Enable Cloudflare Bot Fight Mode (Security > Bots dashboard toggle)
- [ ] Create Cloudflare WAF rule to block known AI scraper user-agents at edge
- [ ] Enable Cloudflare Hotlink Protection (dashboard toggle)

## Context

Anti-scraping report identified that the site has no protection against AI crawlers or image hotlinking. Code-level changes were done in #061, but robots.txt, meta tags, and Cloudflare dashboard config remain.

## Notes

Items 3–5 require manual Cloudflare dashboard configuration, not code changes.

## Source Reports

- `.backlog/reports/complete/RPT-001-anti-scraping-protection-image-serving-architecture.md` — AS1–AS5

Code-level items completed in #061. Cloudflare dashboard items (3–5) require manual configuration.

## Learnings

## Progress Log

- [2026-10-17] Migrated from legacy backlog/ (originally task #081)
