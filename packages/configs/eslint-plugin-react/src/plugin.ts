// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ESLint, Linter} from "eslint"

import {
  accessibleName,
  avatarImageAlt,
  inputLabelAssociation,
  interactiveCardElementNesting,
  preferAlertBannerButton,
  preferCardActions,
  preferHeaderBarActions,
  preferMenuTriggerButtons,
  preferSelectItemCheckbox,
} from "./rules/index.js"

export const rules = {
  "accessible-name": accessibleName,
  "avatar-image-alt": avatarImageAlt,
  "input-label-association": inputLabelAssociation,
  "interactive-card-element-nesting": interactiveCardElementNesting,
  "prefer-alert-banner-button": preferAlertBannerButton,
  "prefer-card-actions": preferCardActions,
  "prefer-header-bar-actions": preferHeaderBarActions,
  "prefer-menu-trigger-buttons": preferMenuTriggerButtons,
  "prefer-select-item-checkbox": preferSelectItemCheckbox,
} as unknown as ESLint.Plugin["rules"]

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
      "@qualcomm-ui/react/prefer-alert-banner-button": "error",
      "@qualcomm-ui/react/prefer-card-actions": "error",
      "@qualcomm-ui/react/prefer-header-bar-actions": "error",
      "@qualcomm-ui/react/prefer-menu-trigger-buttons": "error",
      "@qualcomm-ui/react/prefer-select-item-checkbox": "error",
    },
  },
]
