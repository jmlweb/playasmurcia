# Anti-Scraping Protection & Image Serving Architecture

**Date**: 2026-03-29
**Status**: Pending review
**Trigger**: Cloudinary disabled image delivery due to excessive AI scraper traffic

---

## 1. Problem Statement

AI scrapers (GPTBot, CCBot, Bytespider, etc.) generated enough traffic to cause Cloudinary to remove image delivery for the production site. The site needs:

1. **Scraper protection** that blocks abusive bots while preserving SEO positioning
2. **A resilient image architecture** that doesn't break under scraper load and keeps costs near zero

---

## 2. Anti-Scraping Strategy

A layered defense using Cloudflare's free tier plus standard web conventions.

### Layer 1: `robots.txt` — Block known AI crawlers

Update `public/robots.txt` to explicitly block AI training crawlers while allowing search engines:

```text
# Search engines — allowed
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Yandex
Allow: /

User-agent: DuckDuckBot
Allow: /

# AI crawlers — blocked
User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: Claude-Web
Disallow: /

User-agent: Bytespider
Disallow: /

User-agent: PerplexityBot
Disallow: /

User-agent: Applebot-Extended
Disallow: /

User-agent: cohere-ai
Disallow: /

User-agent: FacebookBot
Disallow: /

User-agent: Meta-ExternalAgent
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: Amazonbot
Disallow: /

User-agent: OAI-SearchBot
Disallow: /

User-agent: YouBot
Disallow: /

User-agent: Diffbot
Disallow: /

User-agent: img2dataset
Disallow: /

User-agent: omgili
Disallow: /

User-agent: PetalBot
Disallow: /

# Default — allow all others
User-agent: *
Allow: /

Sitemap: https://www.playasmurcia.com/sitemap.xml
```

**Note**: `Google-Extended` controls AI training (Gemini) but NOT search indexing — blocking it preserves SEO while opting out of AI training.

**Effectiveness**: Polite layer only. Well-behaved bots honor it; malicious ones ignore it.

### Layer 2: Meta tags — `noai` / `noimageai`

Add to the site's `<head>`:

```html
<meta name="robots" content="noai, noimageai">
```

This tells AI crawlers (those that respect it) not to use content or images for training. Google and Bing honor these directives.

### Layer 3: Cloudflare Bot Fight Mode (free, dashboard toggle)

**Path**: Cloudflare Dashboard > Security > Bots > Bot Fight Mode > ON

Challenges traffic identified as automated. Free tier. No code changes needed.

### Layer 4: Cloudflare WAF Custom Rules (free tier = 5 rules)

Create a single WAF rule to block known AI scraper user-agents at the edge:

**Path**: Cloudflare Dashboard > Security > WAF > Custom Rules > Create Rule

```text
Rule name: Block AI Scrapers
Expression:
  (http.user_agent contains "GPTBot") or
  (http.user_agent contains "CCBot") or
  (http.user_agent contains "ChatGPT") or
  (http.user_agent contains "anthropic-ai") or
  (http.user_agent contains "ClaudeBot") or
  (http.user_agent contains "Bytespider") or
  (http.user_agent contains "PerplexityBot") or
  (http.user_agent contains "Applebot-Extended") or
  (http.user_agent contains "Meta-ExternalAgent") or
  (http.user_agent contains "Google-Extended") or
  (http.user_agent contains "Amazonbot") or
  (http.user_agent contains "Diffbot") or
  (http.user_agent contains "PetalBot") or
  (http.user_agent contains "img2dataset") or
  (http.user_agent contains "cohere-ai")
Action: Block
```

**This is the most important layer** — it stops scrapers at the edge before they consume any bandwidth, regardless of whether they respect robots.txt.

### Layer 5: Cloudflare Hotlink Protection (free, dashboard toggle)

**Path**: Cloudflare Dashboard > Scrape Shield > Hotlink Protection > ON

Prevents other sites from embedding your images directly (inline linking). Saves bandwidth from sites that scrape and re-serve your photos.

### Summary Table

| Layer | Where | Cost | Stops | Effort |
|-------|-------|------|-------|--------|
| robots.txt | Code | $0 | Polite bots | 5 min |
| Meta tags | Code | $0 | Training crawlers | 5 min |
| Bot Fight Mode | Dashboard | $0 | Automated traffic | 1 min toggle |
| WAF custom rule | Dashboard | $0 | Known AI user-agents | 10 min |
| Hotlink Protection | Dashboard | $0 | Image hotlinking | 1 min toggle |

---

## 3. Image Serving Architecture

### Current State

| Aspect | Details |
|--------|---------|
| Source images | ~100+ JPG/PNG in `public/pictures/` (~1GB, committed to git) |
| Optimization | `pnpm optimize:images` generates WebP (quality 80) in `public/pictures/optimized/` |
| Variants | Full-size WebP + thumbnail (400w) per image |
| Rendering | `ResponsiveImage` component with `<picture>` + fallback |
| Serving | Static files via Cloudflare Workers (`@cloudflare/vite-plugin`) |
| Feature flag | `PLAYASMURCIA_OPTIMIZED_IMAGES` env var auto-detected at build time |

### Options Evaluated

| Option | Cost | Scraper Resilience | Complexity | Best For |
|--------|------|--------------------|------------|----------|
| **A. Build-time + static (current, fixed)** | $0 | High (CF egress free) | Low | This project now |
| B. Cloudflare R2 + build-time upload | $0 (free tier) | High | Medium | 500+ images |
| C. Cloudflare Images | $5+/mo | High | Low | Non-dev content teams |
| D. CF Image Transformations | $20+/mo (Pro zone) | High | Low | Over budget |
| E. Worker image proxy | $0 | High | High | Not worth maintaining |

### Recommendation: Fix Option A, plan for Option B

The current architecture is fundamentally correct. The key insight: **Cloudflare has zero egress fees**, so AI scraper bandwidth costs nothing regardless of volume. The Cloudinary failure was a billing model problem, not an architecture problem.

#### Why Option A is correct for now

- **Zero cost**: Static files on Cloudflare edge, no per-request charges
- **Scraper-proof**: No bandwidth billing means abuse has zero cost impact
- **Simple**: No external services, no API keys, no runtime dependencies
- **Fast**: Files served from Cloudflare's global edge cache
- **Already built**: `ResponsiveImage` component handles format negotiation

#### What needs fixing

1. **Verify deployment includes optimized images**: Ensure `public/pictures/optimized/` contents reach Cloudflare in the build output. If CI doesn't run `optimize:images`, production serves only original rasters.

2. **Add AVIF variant**: Sharp supports AVIF natively. Add a third output format for 20-30% better compression than WebP. Update `ResponsiveImage` to include AVIF `<source>` before WebP.

3. **Consider git cleanup**: ~1GB of source PNGs/JPGs in git is heavy. Options:
   - Move sources to R2 as a read-only store, pull in CI only
   - Use Git LFS for the source images
   - Gitignore sources, commit only optimized output

#### Proposed variant matrix

| Variant | Width | Format | Use Case |
|---------|-------|--------|----------|
| thumb | 400px | AVIF + WebP | Beach cards, carousels |
| medium | 800px | AVIF + WebP | Beach detail gallery |
| full | 1200px | AVIF + WebP | Lightbox / full-screen |
| original | as-is | JPG/PNG | Fallback only |

#### When to migrate to Option B (R2)

Triggers for migration:
- Image count exceeds ~500
- Need to add/update photos without full site redeploy
- Git repo size becomes a problem
- Want to serve originals for download without bloating the deploy

Migration path is simple: R2 bucket + URL prefix change in `ResponsiveImage` (one constant).

---

## 4. Implementation Plan

### Phase 1: Anti-scraping (immediate, ~30 min)

| # | Task | Type |
|---|------|------|
| 1 | Update `public/robots.txt` with AI crawler blocks | Code change |
| 2 | Add `noai`/`noimageai` meta tags to `<head>` | Code change |
| 3 | Enable Bot Fight Mode in Cloudflare dashboard | Manual toggle |
| 4 | Create WAF custom rule for AI user-agents | Manual config |
| 5 | Enable Hotlink Protection in Cloudflare dashboard | Manual toggle |

### Phase 2: Image pipeline hardening (1-2 hours)

| # | Task | Type |
|---|------|------|
| 1 | Add AVIF output to `optimize-images.ts` | Code change |
| 2 | Add 1200px "full" variant for detail pages | Code change |
| 3 | Update `ResponsiveImage` with AVIF source + 3 sizes | Code change |
| 4 | Verify CI runs `optimize:images` before build | CI config |
| 5 | Set `Cache-Control: public, max-age=31536000, immutable` for `/pictures/` | Worker/config |

### Phase 3: Git cleanup (optional, when convenient)

| # | Task | Type |
|---|------|------|
| 1 | Move source images to R2 or Git LFS | Migration |
| 2 | Gitignore source rasters, keep optimized output | Config change |
| 3 | Update CI to pull sources from R2 if needed | CI config |

---

## 5. Cost Summary

| Item | Monthly Cost |
|------|-------------|
| Cloudflare Workers (free tier) | $0 |
| Cloudflare CDN/cache | $0 |
| Cloudflare WAF rules (free tier) | $0 |
| Cloudflare Bot Fight Mode | $0 |
| Cloudflare Hotlink Protection | $0 |
| Image storage (static in deploy) | $0 |
| Image bandwidth (CF zero egress) | $0 |
| **Total** | **$0/month** |

---

## 6. Key Takeaway

The Cloudinary incident was a **billing model vulnerability**, not a technical one. Cloudinary charges per transformation and bandwidth — scrapers trigger costs. Cloudflare's zero-egress model makes scraper bandwidth free. Combined with the WAF rule blocking scrapers at the edge, the site becomes resilient to AI crawling at zero cost.
