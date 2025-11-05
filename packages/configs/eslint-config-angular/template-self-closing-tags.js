// template-self-closing.ts
import {defineConfig} from "eslint/config"

export default defineConfig({
  rules: {
    "@angular-eslint/template/prefer-self-closing-tags": "error",
  },
})
