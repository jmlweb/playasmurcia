---
id: TSK-061
title: Anti-Scraping Protection (Code Changes)
status: complete
priority: P1
tags: [infra]
created: 2026-03-29
source: manual
depends-on: []
completed: 2026-03-29
---

# Anti-Scraping Protection (Code Changes)

## Description

As a site owner, I want to block AI scrapers from crawling the site so that image delivery services don't get disabled due to excessive bot traffic.

## Acceptance Criteria

- [x] `public/robots.txt` updated to block known AI crawlers (GPTBot, CCBot, ClaudeBot, Bytespider, PerplexityBot, etc.) while allowing search engines
- [x] `<meta name="robots" content="noai, noimageai">` added to the site's `<head>`
- [x] Search engine indexing (Googlebot, Bingbot) is preserved

## Context

Cloudinary disabled image delivery due to excessive AI scraper traffic (GPTBot, CCBot, Bytespider, etc.). This task covers the code-side changes; Cloudflare dashboard configuration is in **#062**.

## Notes

Report: `.backlog/reports/complete/RPT-001-anti-scraping-protection-image-serving-architecture.md` (Layers 1-2).

## Learnings

## Progress Log

- [2026-10-17] Migrated from legacy backlog/ (originally task #061)
