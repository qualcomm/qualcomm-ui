// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {DummyRuleMap} from "oxlint"

const restriction: DummyRuleMap = {
  // TODO: decide whether to enable. default=off; fixable=none; version=v1.56.0
  "node/handle-callback-err": "off",
  // default=off; category=restriction; fixable=none; version=v0.10.0
  "node/no-new-require": "error",
  // default=off; category=restriction; fixable=none; version=v1.49.0
  "node/no-path-concat": "error",
  // TODO: decide whether to enable. default=off; fixable=none; version=v1.23.0
  "node/no-process-env": "off",
}

const style: DummyRuleMap = {
  // TODO: decide whether to enable. default=off; fixable=none; version=v1.67.0
  "node/callback-return": "off",
  // TODO: decide whether to enable. default=off; fixable=none; version=v1.36.0
  "node/global-require": "off",
  // TODO: decide whether to enable. default=off; fixable=🛠️; version=v0.9.3
  "node/no-exports-assign": "off",
}

export const nodeRules: DummyRuleMap = {
  ...restriction,
  ...style,
}
