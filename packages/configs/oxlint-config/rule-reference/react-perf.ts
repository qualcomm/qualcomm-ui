// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {DummyRuleMap} from "oxlint"

const perf: DummyRuleMap = {
  // default=off; category=perf; fixable=none; version=v0.2.3
  "react-perf/jsx-no-jsx-as-prop": "off",
  // default=off; category=perf; fixable=none; version=v0.2.3
  "react-perf/jsx-no-new-array-as-prop": "off",
  // default=off; category=perf; fixable=none; version=v0.2.3
  "react-perf/jsx-no-new-function-as-prop": "off",
  // default=off; category=perf; fixable=none; version=v0.2.3
  "react-perf/jsx-no-new-object-as-prop": "off",
}

export const reactPerfRules: DummyRuleMap = {
  ...perf,
}
