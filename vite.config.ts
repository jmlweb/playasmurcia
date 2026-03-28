import { existsSync, readdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'

const rootDir = dirname(fileURLToPath(import.meta.url))
const optimizedDir = resolve(rootDir, 'public/pictures/optimized')
const playasmurciaOptimizedImages =
  existsSync(optimizedDir) &&
  readdirSync(optimizedDir).some((name) => name.endsWith('.webp'))

const config = defineConfig({
  define: {
    'import.meta.env.PLAYASMURCIA_OPTIMIZED_IMAGES': JSON.stringify(
      playasmurciaOptimizedImages,
    ),
  },
  plugins: [
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    tailwindcss(),
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
