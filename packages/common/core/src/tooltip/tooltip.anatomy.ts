// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Anatomy, createAnatomy} from "@qualcomm-ui/utils/anatomy"

export const tooltipParts = [
  "root",
  "trigger",
  "positioner",
  "content",
  "arrow",
  "arrowTip",
] as const

export const tooltipAnatomy: Anatomy<"tooltip", (typeof tooltipParts)[number]> =
  createAnatomy("tooltip").parts(...tooltipParts)
