// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {defineConfig} from "eslint/config"

import {typescriptLanguageOptions, typescriptPlugins} from "./base.js"

export default defineConfig({
  languageOptions: typescriptLanguageOptions,
  name: "qui-typechecked-strict-exports",
  plugins: {
    ...typescriptPlugins,
  },
  rules: {
    "@typescript-eslint/consistent-type-exports": [
      "error",
      {fixMixedExportsWithInlineTypeSpecifier: true},
    ],
  },
})
