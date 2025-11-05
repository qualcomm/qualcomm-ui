// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {defineConfig} from "eslint/config"

import {importFromTsconfigPaths} from "./rules/import-from-tsconfig-paths.js"
import {noCircularPathAlias} from "./rules/no-circular-path-alias.js"

export const rules = {
  "import-from-tsconfig-paths": importFromTsconfigPaths,
  "no-circular": noCircularPathAlias,
}

export const plugin = {
  rules,
}

export const config = defineConfig({
  plugins: {
    "path-alias": plugin,
  },
  rules: {
    "path-alias/import-from-tsconfig-paths": "error",
    "path-alias/no-circular": "error",
  },
})
