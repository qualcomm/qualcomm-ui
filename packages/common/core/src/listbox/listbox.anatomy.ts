// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Anatomy, createAnatomy} from "@qualcomm-ui/utils/anatomy"

export const listboxParts = [
  "label",
  "input",
  "item",
  "itemText",
  "itemIndicator",
  "itemGroup",
  "itemGroupLabel",
  "content",
  "root",
] as const

export const listboxAnatomy: Anatomy<"listbox", (typeof listboxParts)[number]> =
  createAnatomy("listbox").parts(...listboxParts)
