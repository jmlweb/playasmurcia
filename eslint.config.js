//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  ...tanstackConfig,
  // Override config for JavaScript scripts (must come after tanstackConfig)
  {
    files: ['scripts/**/*.js'],
    languageOptions: {
      parserOptions: {
        // Don't use TypeScript parser for JS files
        project: null,
      },
      ecmaVersion: 'latest',
      sourceType: 'script', // CommonJS scripts
      globals: {
        __dirname: 'readonly',
        __filename: 'readonly',
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
      },
    },
    rules: {
      // Disable ALL TypeScript-specific rules for JS files
      // This prevents errors from rules that require type information
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/await-thenable': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/return-await': 'off',
      // Allow console in scripts
      'no-console': 'off',
      // More relaxed rules for utility scripts
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
]
