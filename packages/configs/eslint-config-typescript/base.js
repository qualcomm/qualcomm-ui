import {defineConfig} from "eslint/config"
import tseslint from "typescript-eslint"

export default defineConfig({
  languageOptions: {
    ecmaVersion: 2022,
    parser: tseslint.parser,
    parserOptions: {
      ecmaFeatures: {jsx: true},
    },
    sourceType: "module",
  },
  name: "qui-typescript-base",
  plugins: {
    "@typescript-eslint": tseslint.plugin,
  },
})
