// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {MigrationGroup} from "../types.js"

import {reactEmphasisProps} from "./emphasis-props/emphasis-props.js"

export const react: MigrationGroup<"@qualcomm-ui/react"> = {
  codemods: [reactEmphasisProps],
  description:
    "Upgrades @qualcomm-ui/react from v1 to v2. Replaces the deprecated emphasis props and values.",
  name: "react",
  packages: ["@qualcomm-ui/react"],
}
