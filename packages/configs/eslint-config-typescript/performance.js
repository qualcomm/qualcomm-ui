import {defineConfig} from "eslint/config"

export default defineConfig({
  name: "qui-performance",
  rules: {
    "@typescript-eslint/consistent-type-imports": [
      "error",
      {fixStyle: "inline-type-imports"},
    ],
    "@typescript-eslint/no-import-type-side-effects": "error",
  },
})
