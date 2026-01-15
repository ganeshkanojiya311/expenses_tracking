import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  {
    ignores: [
      'dist',
      'node_modules',
      'eslint.config.mjs',
      'jest.config.js',
      'build',
      'dist',
      'tools',
    ],
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      // 'no-console': 'off',
      // "no-unused-vars": "error",
      // 'dot-notation': 'error',
      '@typescript-eslint/no-misused-promises': 'off',
    },
  },
);
