import {defineConfig} from "eslint/config"
import prettier from "eslint-plugin-prettier/recommended"

export default defineConfig({
  extends: [prettier],
  rules: {
    "prettier/prettier": [
      "error",
      {htmlWhitespaceSensitivity: "ignore", parser: "angular"},
    ],
  },
})
