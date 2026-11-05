// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import * as mdx from "eslint-plugin-mdx"
import reactPlugin from "eslint-plugin-react"
import {defineConfig, type Config} from "eslint/config"

const recommended: Config[] = defineConfig({
  ...mdx.flat,
  plugins: {
    ...mdx.flat.plugins,
    react: reactPlugin,
  },
  rules: {
    ...mdx.flat.rules,
    "mdx/remark": "error",
    "no-unused-expressions": "off",
  },
})

export default recommended
