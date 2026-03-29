# Task #061: Anti-Scraping Protection (Code Changes)

## Metadata

- **Status**: done
- **Priority**: P1 - Urgent
- **Slice**: Infra
- **Created**: 2026-03-29
- **Completed**: 2026-03-29
- **Blocked by**: -

## User Story

As a site owner, I want to block AI scrapers from crawling the site so that image delivery services don't get disabled due to excessive bot traffic.

## Context

Cloudinary disabled image delivery due to excessive AI scraper traffic (GPTBot, CCBot, Bytespider, etc.). This task covers the code-side changes; Cloudflare dashboard configuration is in **#062**.

## Acceptance Criteria

- [x] `public/robots.txt` updated to block known AI crawlers (GPTBot, CCBot, ClaudeBot, Bytespider, PerplexityBot, etc.) while allowing search engines
- [x] `<meta name="robots" content="noai, noimageai">` added to the site's `<head>`
- [x] Search engine indexing (Googlebot, Bingbot) is preserved

## Notes

Report: `reports/done/anti-scraping-and-image-architecture.md` (Layers 1-2).
