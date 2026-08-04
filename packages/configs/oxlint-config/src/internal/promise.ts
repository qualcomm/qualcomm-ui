// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {DummyRuleMap} from "oxlint"

const correctness: DummyRuleMap = {
  "promise/no-callback-in-promise": "off",
  "promise/no-new-statics": "error",
  "promise/valid-params": "off",
}

const style: DummyRuleMap = {
  "promise/avoid-new": "off",
  "promise/no-nesting": "error",
  "promise/no-return-wrap": "error",
  "promise/param-names": "error",
  "promise/prefer-await-to-callbacks": "off",
  "promise/prefer-await-to-then": "off",
  "promise/prefer-catch": "off",
}

const suspicious: DummyRuleMap = {
  "promise/always-return": "warn",
  "promise/no-multiple-resolved": "error",
  "promise/no-promise-in-callback": "off",
}

const restriction: DummyRuleMap = {
  "promise/catch-or-return": "warn",
  "promise/spec-only": "error",
}

const nursery: DummyRuleMap = {
  "promise/no-return-in-finally": "warn",
}

export const promiseRules: DummyRuleMap = {
  ...correctness,
  ...style,
  ...suspicious,
  ...restriction,
  ...nursery,
}
