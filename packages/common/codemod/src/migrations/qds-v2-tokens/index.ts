// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {MigrationGroup} from "../types.js"

import {qdsV2TokensCodemod, type QdsV2TokensPackage} from "./qds-v2-tokens.js"

export const qdsV2Tokens: MigrationGroup<QdsV2TokensPackage> = {
  codemods: [qdsV2TokensCodemod],
  description:
    "Renames the legacy spacing, sizing, and border radius tokens in CSS variables and Tailwind classes to their @qualcomm-ui/qds-core v2 names.",
  name: "qds-v2-tokens",
  packages: ["@qualcomm-ui/qds-core", "@qualcomm-ui/tailwind-plugin"],
  warning:
    "Only run this migration if you upgraded from @qualcomm-ui/qds-core v1 to v2 and used the spacing, sizing, or border radius tokens in Tailwind classes or CSS variables directly. In projects that have already been updated, it can rename tokens that are already correct.",
}
