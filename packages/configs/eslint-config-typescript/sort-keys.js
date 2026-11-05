// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import perfectionist from "eslint-plugin-perfectionist"
import {defineConfig} from "eslint/config"

/** @type {NonNullable<import("eslint").Linter.Config["plugins"]>} */
const plugins = {
  perfectionist,
}

export default defineConfig({
  name: "qui-sort-keys",
  plugins,
  rules: {
    "perfectionist/sort-interfaces": [
      "error",
      {
        partitionByComment: ["^group:"],
        type: "natural",
      },
    ],
    "perfectionist/sort-object-types": ["error", {type: "natural"}],
    "perfectionist/sort-objects": [
      "error",
      {
        partitionByComment: ["^group:"],
        type: "natural",
      },
    ],
  },
})
