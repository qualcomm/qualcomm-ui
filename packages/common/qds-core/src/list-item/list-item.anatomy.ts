// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Anatomy, createAnatomy} from "@qualcomm-ui/utils/anatomy"

const parts = [
  "accessory",
  "control",
  "description",
  "indicator",
  "label",
  "root",
  "secondaryText",
  "startIcon",
] as const

export const qdsListItemAnatomy: Anatomy<"list-item", (typeof parts)[number]> =
  createAnatomy("list-item").parts(...parts)
