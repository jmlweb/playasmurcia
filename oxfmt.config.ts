import baseConfig from '@jmlweb/oxfmt-config-base'
import { defineConfig } from 'oxfmt'

export default defineConfig({
  ...baseConfig,
  semi: false,
  sortTailwindcss: {
    stylesheet: './src/styles.css',
  },
  ignorePatterns: [
    'package-lock.json',
    'pnpm-lock.yaml',
    'yarn.lock',
    'src/routeTree.gen.ts',
  ],
})
