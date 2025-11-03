import {defineConfig} from "eslint/config"
import reactPlugin from "eslint-plugin-react"
import reactHooksPlugin from "eslint-plugin-react-hooks"

export default defineConfig({
  languageOptions: {
    globals: {
      JSX: "readonly",
      ParentNode: "readonly",
      RequestInit: "readonly",
    },
    parserOptions: {
      ecmaFeatures: {jsx: true},
    },
  },
  name: "qui-react-base",
  plugins: {
    react: reactPlugin,
    "react-hooks": reactHooksPlugin,
  },
  settings: {
    react: {
      version: "detect",
    },
  },
})
