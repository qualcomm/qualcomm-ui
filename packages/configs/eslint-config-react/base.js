// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import reactPlugin from "eslint-plugin-react"
import reactHooksPlugin from "eslint-plugin-react-hooks"

/** @type {NonNullable<import("eslint").Linter.Config["plugins"]>} */
export const reactPlugins = {
  react: reactPlugin,
  "react-hooks": reactHooksPlugin,
}

export const reactSettings = {
  react: {
    version: "detect",
  },
}
