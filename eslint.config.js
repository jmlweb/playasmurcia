// @ts-check

import reactConfig from '@jmlweb/eslint-config-react'

export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'coverage/**',
      '.output/**',
      '.wrangler/**',
      'data/**',
      // Legacy CommonJS scripts — not compatible with typescript-eslint type-aware rules
      'scripts/**/*.js',
      '*.config.js',
      '*.config.ts',
      '*.config.mjs',
    ],
  },
  ...reactConfig,
  {
    settings: {
      react: {
        version: '19.2',
      },
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'typeLike', format: ['PascalCase'] },
        {
          selector: 'variable',
          filter: { regex: '^_', match: true },
          format: null,
        },
        { selector: 'variable', format: ['camelCase', 'UPPER_CASE'] },
        {
          selector: 'variable',
          modifiers: ['const'],
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
        },
        {
          selector: 'variable',
          modifiers: ['const', 'exported'],
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
        },
        { selector: 'function', format: ['camelCase', 'PascalCase'] },
      ],
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-redundant-type-constituents': 'warn',
      '@typescript-eslint/no-unnecessary-condition': 'warn',
      '@typescript-eslint/no-unnecessary-type-parameters': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/only-throw-error': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        { allowNumber: true },
      ],
    },
  },
  {
    files: ['**/*.{test,spec}.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/require-await': 'off',
      'no-console': 'off',
      'react/display-name': 'off',
    },
  },
]
