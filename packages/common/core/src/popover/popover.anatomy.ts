// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Anatomy, createAnatomy} from "@qualcomm-ui/utils/anatomy"

export const popoverParts = [
  "root",
  "trigger",
  "indicator",
  "positioner",
  "content",
  "label",
  "description",
  "closeTrigger",
  "anchor",
  "arrow",
  "arrowTip",
] as const

export const popoverAnatomy: Anatomy<"popover", (typeof popoverParts)[number]> =
  createAnatomy("popover").parts(...popoverParts)
