// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {defineConfig} from "eslint/config"
import * as mdx from "eslint-plugin-mdx"
import prettierPlugin from "eslint-plugin-prettier"
import reactPlugin from "eslint-plugin-react"

export default defineConfig({
  ...mdx.flat,
  plugins: {
    ...mdx.flat.plugins,
    prettier: prettierPlugin,
    react: reactPlugin,
  },
  rules: {
    ...mdx.flat.rules,
    "no-unused-expressions": "off",
    "prettier/prettier": "error",
  },
})
