// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {DummyRuleMap} from "oxlint"

const correctness: DummyRuleMap = {
  // default=off; category=correctness; fixable=none; version=v0.10.0
  "promise/no-callback-in-promise": "off",
  // default=off; category=correctness; fixable=🛠️; version=v0.6.1
  "promise/no-new-statics": "error",
  // default=off; category=correctness; fixable=none; version=v0.7.1
  "promise/valid-params": "off",
}

const nursery: DummyRuleMap = {
  // default=off; category=nursery; fixable=none; version=v0.7.1
  "promise/no-return-in-finally": "warn",
}

const restriction: DummyRuleMap = {
  // default=off; category=restriction; fixable=none; version=v0.9.2
  "promise/catch-or-return": "warn",
  // default=off; category=restriction; fixable=none; version=v0.9.2
  "promise/spec-only": "error",
}

const style: DummyRuleMap = {
  // default=off; category=style; fixable=none; version=v0.6.1
  "promise/avoid-new": "off",
  // default=off; category=style; fixable=🚧; version=v0.15.13
  "promise/no-nesting": "error",
  // default=off; category=style; fixable=🚧; version=v0.15.14
  "promise/no-return-wrap": "error",
  // default=off; category=style; fixable=none; version=v0.6.1
  "promise/param-names": "error",
  // default=off; category=style; fixable=none; version=v0.9.10
  "promise/prefer-await-to-callbacks": "off",
  // default=off; category=style; fixable=none; version=v0.7.1
  "promise/prefer-await-to-then": "off",
  // default=off; category=style; fixable=🚧; version=v0.15.14
  "promise/prefer-catch": "off",
}

const suspicious: DummyRuleMap = {
  // default=off; category=suspicious; fixable=none; version=v1.13.0
  "promise/always-return": "warn",
  // default=off; category=suspicious; fixable=none; version=v1.19.0
  "promise/no-multiple-resolved": "error",
  // default=off; category=suspicious; fixable=none; version=v0.13.1
  "promise/no-promise-in-callback": "off",
}

export const promiseRules: DummyRuleMap = {
  ...correctness,
  ...nursery,
  ...restriction,
  ...style,
  ...suspicious,
}
