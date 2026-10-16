import { existsSync, readdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'

const rootDir = dirname(fileURLToPath(import.meta.url))
const optimizedDir = resolve(rootDir, 'public/pictures/optimized')
// CI has no local pictures (they live in R2), so it opts in explicitly via env
const playasmurciaOptimizedImages =
  process.env.PLAYASMURCIA_OPTIMIZED_IMAGES === 'true' ||
  (existsSync(optimizedDir) &&
    readdirSync(optimizedDir).some(
      (name) => name.endsWith('.webp') || name.endsWith('.avif'),
    ))

const config = defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  define: {
    'import.meta.env.PLAYASMURCIA_OPTIMIZED_IMAGES': JSON.stringify(
      playasmurciaOptimizedImages,
    ),
  },
  plugins: [
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
