// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {DummyRuleMap} from "oxlint"

const correctness: DummyRuleMap = {
  "oxc/bad-array-method-on-arguments": "error",
  "oxc/bad-char-at-comparison": "error",
  "oxc/bad-comparison-sequence": "error",
  "oxc/bad-min-max-func": "error",
  "oxc/bad-object-literal-comparison": "error",
  "oxc/bad-replace-all-arg": "error",
  "oxc/const-comparisons": "error",
  "oxc/double-comparisons": "error",
  "oxc/erasing-op": "error",
  "oxc/missing-throw": "error",
  "oxc/number-arg-out-of-range": "error",
  "oxc/only-used-in-recursion": "error",
  "oxc/uninvoked-array-callback": "error",
}

const pedantic: DummyRuleMap = {
  "oxc/branches-sharing-code": "off",
}

const perf: DummyRuleMap = {
  "oxc/no-accumulating-spread": "off",
  "oxc/no-map-spread": "off",
}

const restriction: DummyRuleMap = {
  "oxc/bad-bitwise-operator": "off",
  "oxc/no-async-await": "off",
  "oxc/no-barrel-file": "off",
  "oxc/no-const-enum": "off",
  "oxc/no-optional-chaining": "off",
  "oxc/no-rest-spread-properties": "off",
}

const suspicious: DummyRuleMap = {
  "oxc/approx-constant": "off",
  "oxc/misrefactored-assign-op": "off",
  "oxc/no-async-endpoint-handlers": "off",
  "oxc/no-this-in-exported-function": "off",
}

export const oxcRules: DummyRuleMap = {
  ...correctness,
  ...pedantic,
  ...perf,
  ...restriction,
  ...suspicious,
}
