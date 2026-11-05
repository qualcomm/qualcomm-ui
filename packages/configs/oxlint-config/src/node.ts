// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {DummyRuleMap, OxlintConfig} from "oxlint"

export const nodePlugins: NonNullable<OxlintConfig["plugins"]> = ["node"]

export const nodeRules: DummyRuleMap = {
  "node/no-new-require": "error",
  "node/no-path-concat": "error",
}
