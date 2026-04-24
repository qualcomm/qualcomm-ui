// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ESLint, Linter} from "eslint"

import {accessibleName, interactiveCardElementNesting} from "./rules"

export const rules = {
  "accessible-name": accessibleName,
  "interactive-card-element-nesting": interactiveCardElementNesting,
}

export const plugin: ESLint.Plugin = {
  rules: rules as unknown as ESLint.Plugin["rules"],
}

export const config: Linter.Config[] = [
  {
    plugins: {
      "@qualcomm-ui/angular": plugin,
    },
    rules: {
      "@qualcomm-ui/angular/accessible-name": "error",
      "@qualcomm-ui/angular/interactive-card-element-nesting": "error",
    },
  },
]
