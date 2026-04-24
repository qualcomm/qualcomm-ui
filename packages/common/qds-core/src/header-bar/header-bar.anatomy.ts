// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Anatomy, createAnatomy} from "@qualcomm-ui/utils/anatomy"

const parts = [
  "root",
  "logo",
  "actionBar",
  "appTitle",
  "divider",
  "nav",
  "navItem",
  "windowControls",
  "startIcon",
  "endIcon",
] as const

export const headerBarAnatomy: Anatomy<"headerBar", (typeof parts)[number]> =
  createAnatomy("headerBar").parts(...parts)
