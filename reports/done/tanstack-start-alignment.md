# TanStack Start — Alignment Report

Audit of the project against current TanStack Start documentation and best practices (2026-03).

## Status: Good overall

The project follows TanStack Start conventions correctly. Cloudflare deployment config, SSR, file-based routing, and server functions all align with the docs. The issues below range from low to medium priority.

---

## 1. Server functions lack `.inputValidator()` — Medium — **Resolved (2026-03-29)**

Parameterized server functions now chain `.inputValidator()` before `.handler()` in `playas/$slug.tsx`, `municipios/$slug.tsx`, `colecciones/$slug.tsx`, `beach-status-widget.tsx`, and `weather-widget.tsx` (slug / beach / weather payloads validated at the boundary).

**Previous state** (for history): handlers accepted raw `ctx: { data: … }` without a validator:

```ts
// src/routes/playas/$slug.tsx:21
const fetchBeachData = createServerFn({ method: 'GET' }).handler(
  async (ctx: { data: { slug: string } }) => { ... }
)
```

**Reference pattern** (now applied in the codebase):

```ts
const fetchBeachData = createServerFn({ method: 'GET' })
  .inputValidator((d: { slug: string }) => {
    if (typeof d.slug !== 'string' || !d.slug) throw new Error('Invalid slug')
    return d
  })
  .handler(async ({ data }) => { ... })
```

---

## 2. Dynamic `import()` in every server function — Low

**Current**: Every server function uses dynamic `await import('@/lib/db-data')` inside the handler:

```ts
const fetchHomeData = createServerFn({ method: 'GET' }).handler(async () => {
  const { getFeaturedBeaches, ... } = await import('@/lib/db-data')
  ...
})
```

**Analysis**: This was likely needed to prevent DB client code from leaking into the client bundle. TanStack Start's bundler should handle this automatically — code inside `.handler()` is server-only by design.

**Recommended**: Test replacing one dynamic import with a top-level static import. If the build succeeds without bundling `@libsql/client` into the client, switch all server functions to static imports for cleaner code and better tree-shaking.

**Risk**: Low — if it doesn't work on Cloudflare Workers, revert. Worth a quick test.

---

## 3. No global middleware (`src/start.ts`) — Low

**Current**: No `src/start.ts` file exists. No middleware of any kind is used.

**What it enables**: A `createStart({ requestMiddleware: [...] })` entry point would allow:
- Request logging / tracing
- Global security headers (CSP, HSTS)
- Rate limiting or abuse detection
- Cache-control headers for SSR responses

**Recommended**: Not urgent for a content site, but worth adding when the project needs any cross-cutting server behavior. The current `edge-cache.ts` utility is called ad-hoc from individual functions — a caching middleware could centralize this.

---

## 4. `nitro` listed as direct production dependency — Low

**Current** (`package.json:37`):
```json
"nitro": "latest"
```

**Analysis**: TanStack Start uses Nitro internally as its server engine, but it should be resolved transitively through `@tanstack/react-start`. Listing it as a direct `"latest"` dependency risks version conflicts and unexpected breakage on `pnpm install`.

**Recommended**: Remove `"nitro": "latest"` from `dependencies`. If the build breaks, pin the version that `@tanstack/react-start` expects rather than using `"latest"`.

---

## 5. No selective SSR — Informational

**Current**: All routes use SSR (`ssr: true` globally). The explorer page (`/explorar`) renders all beaches server-side even though the page is primarily interactive (filters, search, pagination).

**Analysis**: For this project, full SSR is correct — SEO matters for every public page. The `/explorar` page benefits from SSR because search engines can index the full beach listing. No change needed.

---

## Summary

| # | Issue | Priority | Effort |
|---|-------|----------|--------|
| 1 | Add `.inputValidator()` to parameterized server functions | Done (2026-03-29) | — |
| 2 | Test static imports in server function handlers | Low | Small |
| 3 | Consider `src/start.ts` for global middleware | Low | — |
| 4 | Remove direct `nitro` dependency | Low | Trivial |
| 5 | Selective SSR | None | — |
