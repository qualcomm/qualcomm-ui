// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {MigrationGroup} from "../types.js"

import {angularEmphasisProps} from "./emphasis-props/emphasis-props.js"

export const angular: MigrationGroup<"@qualcomm-ui/angular"> = {
  codemods: [angularEmphasisProps],
  description: "Projects that use @qualcomm-ui/angular",
  name: "angular",
  packages: ["@qualcomm-ui/angular"],
}
