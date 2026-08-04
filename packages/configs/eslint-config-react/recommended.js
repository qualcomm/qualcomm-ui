// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import reactPlugin from "eslint-plugin-react"
import {defineConfig} from "eslint/config"

import {reactPlugins, reactSettings} from "./base.js"

export default defineConfig({
  name: "qui-react-recommended",
  plugins: {
    ...reactPlugins,
  },
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
  settings: {...reactSettings},
})
