// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Anatomy, createAnatomy} from "@qualcomm-ui/utils/anatomy"

export const tabsParts = [
  "root",
  "list",
  "tab",
  "tabButton",
  "tabIcon",
  "tabDismissButton",
  "panel",
  "indicator",
] as const

export const tabsAnatomy: Anatomy<"tabs", (typeof tabsParts)[number]> =
  createAnatomy("tabs").parts(...tabsParts)
