// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ESLint, Linter} from "eslint"

import {
  accessibleName,
  avatarImageAlt,
  inputLabelAssociation,
  interactiveCardElementNesting,
  noButtonInHeaderBar,
} from "./rules"

export const rules = {
  "accessible-name": accessibleName,
  "avatar-image-alt": avatarImageAlt,
  "input-label-association": inputLabelAssociation,
  "interactive-card-element-nesting": interactiveCardElementNesting,
  "no-button-in-header-bar": noButtonInHeaderBar,
}

export const plugin: ESLint.Plugin = {
  // typescript-eslint data structures are used for JSX support but
  // the types are not compatible with eslint rule definitions
  rules: rules as unknown as ESLint.Plugin["rules"],
}

export const config: Linter.Config[] = [
  {
    plugins: {
      "@qualcomm-ui/react": plugin,
    },
    rules: {
      "@qualcomm-ui/react/accessible-name": "error",
      "@qualcomm-ui/react/avatar-image-alt": "error",
      "@qualcomm-ui/react/input-label-association": "error",
      "@qualcomm-ui/react/interactive-card-element-nesting": "error",
      "@qualcomm-ui/react/no-button-in-header-bar": "error",
    },
  },
]
