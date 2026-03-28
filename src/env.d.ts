/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** True when `public/pictures/optimized/` contains at least one `.webp` (set at Vite startup). */
  readonly PLAYASMURCIA_OPTIMIZED_IMAGES: boolean
}
