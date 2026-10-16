import reactConfig from '@jmlweb/oxlint-config-react'
import { defineConfig } from 'oxlint'

export default defineConfig({
  extends: [reactConfig],
  // Oxlint reads `options` only from the root config, never from `extends`
  options: {
    typeAware: true,
  },
  settings: {
    'react-x': {
      version: '19.3',
    },
  },
  ignorePatterns: [
    'dist/**',
    'node_modules/**',
    'coverage/**',
    '.output/**',
    '.wrangler/**',
    '.claude/**',
    'data/**',
    'src/routeTree.gen.ts',
    // Legacy CommonJS scripts and config files are outside tsconfig, so type-aware rules cannot run on them
    'scripts/**/*.js',
    '*.config.js',
    '*.config.ts',
    '*.config.mjs',
  ],
  overrides: [
    {
      files: ['src/**/*.{ts,tsx}'],
      rules: {
        'typescript/no-non-null-assertion': 'warn',
        'typescript/no-redundant-type-constituents': 'warn',
        'typescript/no-unnecessary-condition': 'warn',
        'typescript/no-unnecessary-type-parameters': 'off',
        'typescript/no-unsafe-assignment': 'warn',
        'typescript/no-unsafe-call': 'warn',
        'typescript/no-unsafe-member-access': 'warn',
        'typescript/no-unsafe-return': 'warn',
        'eslint/no-unused-vars': [
          'error',
          {
            argsIgnorePattern: '^_',
            caughtErrorsIgnorePattern: '^_',
            varsIgnorePattern: '^_',
          },
        ],
        'typescript/only-throw-error': 'off',
        'typescript/prefer-nullish-coalescing': 'warn',
        'typescript/restrict-template-expressions': [
          'error',
          { allowNumber: true },
        ],
      },
    },
    {
      files: ['**/*.{test,spec}.{ts,tsx}'],
      rules: {
        'typescript/no-explicit-any': 'off',
        'typescript/require-await': 'off',
        'eslint/no-console': 'off',
        '@eslint-react/no-missing-component-display-name': 'off',
      },
    },
  ],
})
