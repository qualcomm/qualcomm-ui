// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {DummyRuleMap} from "oxlint"

const correctness: DummyRuleMap = {
  "jsx-a11y/alt-text": "error",
  "jsx-a11y/anchor-has-content": "off",
  "jsx-a11y/anchor-is-valid": "off",
  "jsx-a11y/aria-activedescendant-has-tabindex": "off",
  "jsx-a11y/aria-props": "error",
  "jsx-a11y/aria-proptypes": "off",
  "jsx-a11y/aria-role": "error",
  "jsx-a11y/aria-unsupported-elements": "error",
  "jsx-a11y/autocomplete-valid": "off",
  "jsx-a11y/click-events-have-key-events": "warn",
  "jsx-a11y/control-has-associated-label": "off",
  "jsx-a11y/heading-has-content": "off",
  "jsx-a11y/html-has-lang": "error",
  "jsx-a11y/iframe-has-title": "off",
  "jsx-a11y/img-redundant-alt": "off",
  "jsx-a11y/interactive-supports-focus": "off",
  "jsx-a11y/label-has-associated-control": "off",
  "jsx-a11y/lang": "error",
  "jsx-a11y/media-has-caption": "off",
  "jsx-a11y/mouse-events-have-key-events": "error",
  "jsx-a11y/no-access-key": "error",
  "jsx-a11y/no-aria-hidden-on-focusable": "error",
  "jsx-a11y/no-autofocus": "off",
  "jsx-a11y/no-distracting-elements": "off",
  "jsx-a11y/no-interactive-element-to-noninteractive-role": "error",
  "jsx-a11y/no-noninteractive-element-interactions": "off",
  "jsx-a11y/no-noninteractive-element-to-interactive-role": "off",
  "jsx-a11y/no-noninteractive-tabindex": "off",
  "jsx-a11y/no-redundant-roles": "error",
  "jsx-a11y/no-static-element-interactions": "off",
  "jsx-a11y/prefer-tag-over-role": "warn",
  "jsx-a11y/role-has-required-aria-props": "warn",
  "jsx-a11y/role-supports-aria-props": "warn",
  "jsx-a11y/scope": "off",
  "jsx-a11y/tabindex-no-positive": "off",
}

const restriction: DummyRuleMap = {
  "jsx-a11y/anchor-ambiguous-text": "off",
}

export const jsxA11yRules: DummyRuleMap = {
  ...correctness,
  ...restriction,
}
