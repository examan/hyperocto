import neostandard from 'neostandard'
import eslintConfigPrettier from 'eslint-config-prettier'

export default [
  ...neostandard({
    ts: true,
    noStyle: true,
    env: ['browser', 'webextensions'],
  }),
  eslintConfigPrettier,
  {
    rules: {
      'capitalized-comments': 'off',
      'default-case': 'off',
      'func-style': ['error', 'declaration'],
      'max-lines-per-function': 'off',
      'max-statements': 'off',
      'multiline-comment-style': ['error', 'separate-lines'],
      'no-console': 'off',
      'no-ternary': 'off',
      'no-continue': 'off',
      'no-alert': 'off',
      'no-void': 'off',
      '@typescript-eslint/no-magic-numbers': ['error', { ignore: [0, 1] }],
      '@typescript-eslint/no-type-alias': 'off',
      '@typescript-eslint/prefer-readonly-parameter-types': 'off',
      '@typescript-eslint/prefer-enum-initializers': 'off',
    },
  },
  {
    files: ["**/*.test.ts"],
    rules: {
      "@typescript-eslint/no-magic-numbers": "off",
    },
  },
]
