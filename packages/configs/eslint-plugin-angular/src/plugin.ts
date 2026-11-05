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
  rules,
}

export const config: Linter.Config[] = [
  {
    plugins: {
      "@qualcomm-ui/angular": plugin,
    },
    rules: {
      "@qualcomm-ui/angular/accessible-name": "error",
      "@qualcomm-ui/angular/avatar-image-alt": "error",
      "@qualcomm-ui/angular/input-label-association": "error",
      "@qualcomm-ui/angular/interactive-card-element-nesting": "error",
      "@qualcomm-ui/angular/prefer-alert-banner-button": "error",
      "@qualcomm-ui/angular/prefer-card-actions": "error",
      "@qualcomm-ui/angular/prefer-header-bar-actions": "error",
      "@qualcomm-ui/angular/prefer-menu-trigger-buttons": "error",
      "@qualcomm-ui/angular/prefer-select-item-checkbox": "error",
    },
  },
]
