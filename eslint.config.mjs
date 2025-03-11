import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    rules: {
      'prettier/prettier': [
        'warn',
        {
          singleQuote: true,
          semi: false,
          trailingComma: 'es5',
          tabWidth: 2,
          printWidth: 100,
        },
      ],
      camelcase: 'warn', // Alterado para warn para permitir Geist_Mono
    },
  },
]

export default eslintConfig
