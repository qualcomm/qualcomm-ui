import {defineConfig} from "eslint/config"
import reactPlugin from "eslint-plugin-react"

export default defineConfig({
  name: "qui-react-recommended",
  rules: {
    ...reactPlugin.configs.recommended.rules,
    "no-prototype-builtins": "off",
    "no-restricted-imports": [
      "error",
      {
        paths: [
          {
            importNames: ["default"],
            message:
              "the React default import is no longer required since v17. You may need to update your tsconfig.compileOptions.jsx setting to 'react-jsx' to allow this",
            name: "react",
          },
        ],
      },
    ],
    "prettier/prettier": "error",
    "react-hooks/exhaustive-deps": [
      "error",
      {
        enableDangerousAutofixThisMayCauseInfiniteLoops: true,
      },
    ],
    "react-hooks/rules-of-hooks": "error",
    "react/jsx-boolean-value": ["error", "never"],
    "react/jsx-curly-brace-presence": [
      "error",
      {children: "never", propElementValues: "always", props: "never"},
    ],
    "react/jsx-sort-props": [
      "error",
      {
        reservedFirst: ["key", "ref"],
      },
    ],
    "react/no-array-index-key": "off",
    "react/react-in-jsx-scope": "off",
    "react/self-closing-comp": ["error", {component: true, html: false}],
  },
})
