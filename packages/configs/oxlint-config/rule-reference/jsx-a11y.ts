// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {DummyRuleMap} from "oxlint"

const correctness: DummyRuleMap = {
  // default=off; category=correctness; fixable=none; version=v0.0.16
  "jsx-a11y/alt-text": "error",
  // default=off; category=correctness; fixable=💡; version=v0.0.18
  "jsx-a11y/anchor-has-content": "off",
  // default=off; category=correctness; fixable=none; version=v0.0.19
  "jsx-a11y/anchor-is-valid": "off",
  // default=off; category=correctness; fixable=none; version=v0.2.1
  "jsx-a11y/aria-activedescendant-has-tabindex": "off",
  // default=off; category=correctness; fixable=🛠️; version=v0.0.22
  "jsx-a11y/aria-props": "error",
  // default=off; category=correctness; fixable=none; version=v1.36.0
  "jsx-a11y/aria-proptypes": "off",
  // default=off; category=correctness; fixable=none; version=v0.1.1
  "jsx-a11y/aria-role": "error",
  // default=off; category=correctness; fixable=🛠️; version=v0.1.1
  "jsx-a11y/aria-unsupported-elements": "error",
  // default=off; category=correctness; fixable=none; version=v0.2.0
  "jsx-a11y/autocomplete-valid": "off",
  // default=off; category=correctness; fixable=none; version=v0.2.1
  "jsx-a11y/click-events-have-key-events": "warn",
  // default=off; category=correctness; fixable=none; version=v1.65.0
  "jsx-a11y/control-has-associated-label": "off",
  // default=off; category=correctness; fixable=none; version=v0.0.19
  "jsx-a11y/heading-has-content": "off",
  // default=off; category=correctness; fixable=none; version=v0.0.18
  "jsx-a11y/html-has-lang": "error",
  // default=off; category=correctness; fixable=none; version=v0.0.19
  "jsx-a11y/iframe-has-title": "off",
  // default=off; category=correctness; fixable=none; version=v0.0.19
  "jsx-a11y/img-redundant-alt": "off",
  // default=off; category=correctness; fixable=💡; version=v1.63.0
  "jsx-a11y/interactive-supports-focus": "off",
  // default=off; category=correctness; fixable=none; version=v0.9.1
  "jsx-a11y/label-has-associated-control": "off",
  // default=off; category=correctness; fixable=none; version=v0.1.1
  "jsx-a11y/lang": "error",
  // default=off; category=correctness; fixable=none; version=v0.1.1
  "jsx-a11y/media-has-caption": "off",
  // default=off; category=correctness; fixable=none; version=v0.1.1
  "jsx-a11y/mouse-events-have-key-events": "error",
  // default=off; category=correctness; fixable=💡; version=v0.0.21
  "jsx-a11y/no-access-key": "error",
  // default=off; category=correctness; fixable=🛠️; version=v0.0.22
  "jsx-a11y/no-aria-hidden-on-focusable": "error",
  // default=off; category=correctness; fixable=💡; version=v0.0.19
  "jsx-a11y/no-autofocus": "off",
  // default=off; category=correctness; fixable=none; version=v0.0.22
  "jsx-a11y/no-distracting-elements": "off",
  // default=off; category=correctness; fixable=none; version=v1.65.0
  "jsx-a11y/no-interactive-element-to-noninteractive-role": "error",
  // default=off; category=correctness; fixable=none; version=v1.65.0
  "jsx-a11y/no-noninteractive-element-interactions": "off",
  // default=off; category=correctness; fixable=none; version=v1.64.0
  "jsx-a11y/no-noninteractive-element-to-interactive-role": "off",
  // default=off; category=correctness; fixable=none; version=v0.15.4
  "jsx-a11y/no-noninteractive-tabindex": "off",
  // default=off; category=correctness; fixable=🛠️; version=v0.2.1
  "jsx-a11y/no-redundant-roles": "error",
  // default=off; category=correctness; fixable=none; version=v1.37.0
  "jsx-a11y/no-static-element-interactions": "off",
  // default=off; category=correctness; fixable=none; version=v0.1.1
  "jsx-a11y/prefer-tag-over-role": "warn",
  // default=off; category=correctness; fixable=none; version=v0.2.0
  "jsx-a11y/role-has-required-aria-props": "error",
  // default=off; category=correctness; fixable=none; version=v0.2.0
  "jsx-a11y/role-supports-aria-props": "error",
  // default=off; category=correctness; fixable=🛠️; version=v0.0.19
  "jsx-a11y/scope": "off",
  // default=off; category=correctness; fixable=⚠️ 💡; version=v0.0.21
  "jsx-a11y/tabindex-no-positive": "off",
}

const restriction: DummyRuleMap = {
  // default=off; category=restriction; fixable=none; version=v0.13.2
  "jsx-a11y/anchor-ambiguous-text": "off",
}

export const jsxA11yRules: DummyRuleMap = {
  ...correctness,
  ...restriction,
}
