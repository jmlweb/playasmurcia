/// <reference types="vite/client" />

/** Cloudflare Workers `caches.default` (not in DOM lib). */
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- declaration merge with DOM `CacheStorage`
interface CacheStorage {
  readonly default: Cache
}

type ImportMetaEnv = {
  /** True when `public/pictures/optimized/` contains at least one `.webp` (set at Vite startup). */
  readonly PLAYASMURCIA_OPTIMIZED_IMAGES: boolean
}
