// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Anatomy, createAnatomy} from "@qualcomm-ui/utils/anatomy"

export const overflowListParts = ["root", "item", "indicator"] as const

export const overflowListAnatomy: Anatomy<
  "overflow-list",
  (typeof overflowListParts)[number]
> = createAnatomy("overflow-list").parts(...overflowListParts)
