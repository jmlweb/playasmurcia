import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import baseVitest from '@jmlweb/vitest-config'

export default defineConfig({
  plugins: [
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    viteReact(),
  ],
  test: {
    ...baseVitest.test,
    environment: 'jsdom',
    // @jmlweb/vitest-config sets 80% thresholds and broad `include`; this app only
    // covers a subset of `src/` in tests — keep reporters/provider without global gates.
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
})
