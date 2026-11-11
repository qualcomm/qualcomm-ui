// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {MigrationGroup} from "../types.js"

import {reactEmphasisProps} from "./emphasis-props/emphasis-props.js"
import {reactInlineIconButton} from "./inline-icon-button/inline-icon-button.js"

export const react: MigrationGroup<"@qualcomm-ui/react"> = {
  codemods: [reactEmphasisProps, reactInlineIconButton],
  description:
    "Upgrades @qualcomm-ui/react from v1 to v2. Replaces the deprecated emphasis props and values, and InlineIconButton.",
  name: "react",
  packages: ["@qualcomm-ui/react"],
}
