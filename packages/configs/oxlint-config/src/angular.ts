// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {defineConfig, type OxlintConfig} from "oxlint"

// something like this
export const angularConfig: OxlintConfig = defineConfig({
  jsPlugins: [
    {
      name: "@angular-eslint",
      specifier: "@angular-eslint/eslint-plugin",
    },
  ],
  overrides: [
    {
      files: ["src/**/*.ts"],
      rules: {
        "@angular-eslint/component-selector": [
          "error",
          {prefix: "app", style: "kebab-case", type: "element"},
        ],
        "@angular-eslint/directive-selector": [
          "error",
          {prefix: "app", style: "camelCase", type: "attribute"},
        ],
      },
    },
  ],
})
