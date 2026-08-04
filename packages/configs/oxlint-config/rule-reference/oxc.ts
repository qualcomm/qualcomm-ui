// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {DummyRuleMap} from "oxlint"

const correctness: DummyRuleMap = {
  // default=error; category=correctness; fixable=none; version=v0.0.3
  "oxc/bad-array-method-on-arguments": "error",
  // default=error; category=correctness; fixable=none; version=v0.0.22
  "oxc/bad-char-at-comparison": "error",
  // default=error; category=correctness; fixable=none; version=v0.0.3
  "oxc/bad-comparison-sequence": "error",
  // default=error; category=correctness; fixable=none; version=v0.0.3
  "oxc/bad-min-max-func": "error",
  // default=error; category=correctness; fixable=none; version=v0.1.1
  "oxc/bad-object-literal-comparison": "error",
  // default=error; category=correctness; fixable=none; version=v0.0.22
  "oxc/bad-replace-all-arg": "error",
  // default=error; category=correctness; fixable=none; version=v0.0.22
  "oxc/const-comparisons": "error",
  // default=error; category=correctness; fixable=💡; version=v0.0.22
  "oxc/double-comparisons": "error",
  // default=error; category=correctness; fixable=⚠️ 🛠️; version=v0.1.1
  "oxc/erasing-op": "error",
  // default=error; category=correctness; fixable=💡; version=v0.0.3
  "oxc/missing-throw": "error",
  // default=error; category=correctness; fixable=none; version=v0.0.3
  "oxc/number-arg-out-of-range": "error",
  // default=error; category=correctness; fixable=⚠️ 🛠️; version=v0.1.1
  "oxc/only-used-in-recursion": "error",
  // default=error; category=correctness; fixable=none; version=v0.0.3
  "oxc/uninvoked-array-callback": "error",
}

const pedantic: DummyRuleMap = {
  // default=off; category=pedantic; fixable=💡; version=v1.22.0
  "oxc/branches-sharing-code": "off",
}

const perf: DummyRuleMap = {
  // default=off; category=perf; fixable=none; version=v0.0.19
  "oxc/no-accumulating-spread": "off",
  // default=off; category=perf; fixable=💡; version=v0.11.0
  "oxc/no-map-spread": "off",
}

const restriction: DummyRuleMap = {
  // default=off; category=restriction; fixable=💡; version=v0.0.3
  "oxc/bad-bitwise-operator": "off",
  // default=off; category=restriction; fixable=none; version=v0.4.2
  "oxc/no-async-await": "off",
  // default=off; category=restriction; fixable=none; version=v0.3.0
  "oxc/no-barrel-file": "off",
  // default=off; category=restriction; fixable=🛠️; version=v0.4.2
  "oxc/no-const-enum": "off",
  // default=off; category=restriction; fixable=none; version=v0.5.0
  "oxc/no-optional-chaining": "off",
  // default=off; category=restriction; fixable=none; version=v0.4.2
  "oxc/no-rest-spread-properties": "off",
}

const suspicious: DummyRuleMap = {
  // default=off; category=suspicious; fixable=💡; version=v0.1.1
  "oxc/approx-constant": "off",
  // default=off; category=suspicious; fixable=💡; version=v0.1.1
  "oxc/misrefactored-assign-op": "off",
  // default=off; category=suspicious; fixable=none; version=v0.9.2
  "oxc/no-async-endpoint-handlers": "off",
  // default=off; category=suspicious; fixable=none; version=v1.33.0
  "oxc/no-this-in-exported-function": "off",
}

export const oxcRules: DummyRuleMap = {
  ...correctness,
  ...pedantic,
  ...perf,
  ...restriction,
  ...suspicious,
}
