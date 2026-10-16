import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'
import baseVitest from '@jmlweb/vitest-config'

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [viteReact()],
  test: {
    ...baseVitest.test,
    environment: 'jsdom',
    // Agent worktrees under .claude/ hold unrelated repo copies with their own tsconfigs.
    exclude: [...(baseVitest.test?.exclude ?? []), '**/.claude/**'],
    // @jmlweb/vitest-config sets 80% thresholds and broad `include`; this app only
    // covers a subset of `src/` in tests — keep reporters/provider without global gates.
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
})
