import pluginJs from '@eslint/js'
import globals from 'globals'
import { defineConfig } from 'eslint/config'
import stylistic from '@stylistic/eslint-plugin'

export default defineConfig([
  stylistic.configs.recommended,
  pluginJs.configs.recommended,
  {
    files: [
      '**/*.{js,ts,tsx}',
    ],
  },
  {
    ignores: ['dist/'],
  },
  {
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
