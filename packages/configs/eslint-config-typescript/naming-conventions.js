// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {defineConfig} from "eslint/config"

export default defineConfig({
  name: "qui-typechecked-naming-convention",
  rules: {
    "@typescript-eslint/naming-convention": [
      "error",
      {
        custom: {
          match: false,
          regex: "^I[A-Z]",
        },
        format: ["PascalCase"],
        selector: ["class", "enum", "interface", "typeAlias"],
      },
      {
        custom: {
          match: false,
          regex: "^I[A-Z]",
        },
        format: ["PascalCase"],
        leadingUnderscore: "allow",
        selector: ["typeParameter"],
      },
      {
        format: ["PascalCase"],
        selector: "class",
      },
      {
        filter: {
          match: false,
          regex: "^((ngAcceptInputType))",
        },
        format: ["camelCase"],
        leadingUnderscore: "allow",
        selector: ["classMethod", "classProperty"],
      },
      {
        filter: {
          match: false,
          regex: "^((ngAcceptInputType))",
        },
        format: ["camelCase", "PascalCase"],
        leadingUnderscore: "allow",
        modifiers: ["protected", "readonly"],
        selector: ["classMethod", "classProperty", "parameterProperty"],
      },
    ],
  },
})
