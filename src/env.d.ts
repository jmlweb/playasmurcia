/// <reference types="vite/client" />

/** Cloudflare Workers `caches.default` (not in DOM lib). */
// oxlint-disable-next-line typescript/consistent-type-definitions -- declaration merge with DOM `CacheStorage`
interface CacheStorage {
  readonly default: Cache
}

// oxlint-disable-next-line typescript/consistent-type-definitions -- must be an interface to merge with Vite's `ImportMetaEnv`
interface ImportMetaEnv {
  /** True when optimized variants exist locally or `PLAYASMURCIA_OPTIMIZED_IMAGES=true` is set (resolved at Vite startup). */
  readonly PLAYASMURCIA_OPTIMIZED_IMAGES: boolean
  /** Mapbox public token, inlined at build time. */
  readonly VITE_MAPBOX_TOKEN: string
  /** R2 pictures domain, e.g. `https://img.playasmurcia.com`. Unset in local dev (falls back to `/pictures`). */
  readonly VITE_PICTURES_BASE_URL?: string
}
