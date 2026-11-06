// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Codemod} from "../types.js"

import {MEASUREMENT_SCALES} from "./measurement-tokens/measurement-tokens.js"
import {TAILWIND_SCALES} from "./tailwind-spacing/tailwind-spacing.js"
import {runScaleCodemod} from "./token-scales.js"

export type QdsV2TokensPackage =
  | "@qualcomm-ui/qds-core"
  | "@qualcomm-ui/tailwind-plugin"

const NAME = "qds-v2-tokens"

/**
 * Renames the legacy CSS variables and Tailwind spacing utilities in a single
 * codemod, so that one record covers every scale. Separate codemods sharing a
 * record would see the first one's record and keep the second one's legacy
 * ambiguous steps.
 */
export const qdsV2TokensCodemod: Codemod<QdsV2TokensPackage> = {
  name: NAME,
  noMatchMessage:
    "no spacing, sizing, border radius, or Tailwind spacing tokens found, nothing to change",
  run: (ctx) =>
    runScaleCodemod(ctx, NAME, [...MEASUREMENT_SCALES, ...TAILWIND_SCALES]),
  title:
    "Rename the spacing, sizing, and border radius variables and the Tailwind spacing utilities",
  versions: {
    "@qualcomm-ui/qds-core": {from: 1, to: 2},
    "@qualcomm-ui/tailwind-plugin": {from: 1, to: 2},
  },
}
