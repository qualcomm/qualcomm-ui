// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {defineConfig} from "eslint/config"

export default defineConfig({
  name: "qui-typechecked-strict-exports",
  rules: {
    "@typescript-eslint/consistent-type-exports": [
      "error",
      {fixMixedExportsWithInlineTypeSpecifier: true},
    ],
  },
})
