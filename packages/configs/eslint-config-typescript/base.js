// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import tseslint from "typescript-eslint"

export const typescriptLanguageOptions = {
  ecmaVersion: 2022,
  parser: tseslint.parser,
  parserOptions: {
    ecmaFeatures: {jsx: true},
  },
  sourceType: "module",
}

export const typescriptPlugins = {
  "@typescript-eslint": tseslint.plugin,
}
