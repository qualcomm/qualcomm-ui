// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {MigrationGroup} from "../types.js"

import {reactEmphasisProps} from "./emphasis-props/emphasis-props.js"

export const react: MigrationGroup<"@qualcomm-ui/react"> = {
  codemods: [reactEmphasisProps],
  description: "Projects that use @qualcomm-ui/react",
  name: "react",
  packages: ["@qualcomm-ui/react"],
}
