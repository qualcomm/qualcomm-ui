// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Anatomy, createAnatomy} from "@qualcomm-ui/utils/anatomy"

export const selectParts = [
  "root",
  "label",
  "hint",
  "errorText",
  "errorIndicator",
  "control",
  "indicator",
  "valueText",
  "item",
  "itemText",
  "itemIndicator",
  "itemGroup",
  "itemGroupLabel",
  "clearTrigger",
  "hiddenSelect",
  "positioner",
  "content",
] as const

export const selectAnatomy: Anatomy<"select", (typeof selectParts)[number]> =
  createAnatomy("select").parts(...selectParts)
