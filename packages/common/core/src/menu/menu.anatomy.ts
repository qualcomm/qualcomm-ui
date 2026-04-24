// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Anatomy, createAnatomy} from "@qualcomm-ui/utils/anatomy"

export const menuParts = [
  "arrow",
  "arrowTip",
  "content",
  "contextTrigger",
  "item",
  "itemControl",
  "itemGroup",
  "itemGroupLabel",
  "itemIndicator",
  "itemText",
  "positioner",
  "separator",
  "trigger",
] as const

export const menuAnatomy: Anatomy<"menu", (typeof menuParts)[number]> =
  createAnatomy("menu").parts(...menuParts)
