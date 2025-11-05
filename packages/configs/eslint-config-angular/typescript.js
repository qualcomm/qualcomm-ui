import {defineConfig} from "eslint/config"

export default defineConfig({
  name: "qui-angular-typescript",
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
