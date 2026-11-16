// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Anatomy, createAnatomy} from "@qualcomm-ui/utils/anatomy"

export const tableFilterPanelParts = [
  "root",
  "applyTrigger",
  "clearTrigger",
] as const

export const tableFilterPanelAnatomy: Anatomy<
  "table-filter-panel",
  (typeof tableFilterPanelParts)[number]
> = createAnatomy("table-filter-panel").parts(...tableFilterPanelParts)
