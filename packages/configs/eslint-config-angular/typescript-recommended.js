import angularEslint from "angular-eslint"
import {defineConfig} from "eslint/config"

export default defineConfig({
  extends: [...angularEslint.configs.tsRecommended],
  name: "qui-angular-typescript",
  plugins: {"@angular-eslint": angularEslint.tsPlugin},
  processor: angularEslint.processInlineTemplates,
  rules: {
    "@angular-eslint/component-class-suffix": ["off"],
    "@angular-eslint/directive-class-suffix": "off",
    "@angular-eslint/no-host-metadata-property": "off",
    "@angular-eslint/no-input-rename": "warn",
    "@angular-eslint/prefer-signals": "error",

    // Ban globals for SSR-compatible code
    "no-restricted-globals": [
      "error",
      "window",
      "document",
      "navigator",
      "location",
      "localStorage",
      "sessionStorage",
    ],
  },
})
