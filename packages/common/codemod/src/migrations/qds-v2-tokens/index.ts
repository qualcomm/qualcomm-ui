// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {MigrationGroup} from "../types.js"

import {qdsV2TokensCodemod, type QdsV2TokensPackage} from "./qds-v2-tokens.js"

export const qdsV2Tokens: MigrationGroup<QdsV2TokensPackage> = {
  codemods: [qdsV2TokensCodemod],
  description:
    "Projects that use the legacy QDS spacing, sizing, and border radius tokens",
  name: "qds-v2-tokens",
  packages: ["@qualcomm-ui/qds-core", "@qualcomm-ui/tailwind-plugin"],
}
