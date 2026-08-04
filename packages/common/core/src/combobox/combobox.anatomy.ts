// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Anatomy, createAnatomy} from "@qualcomm-ui/utils/anatomy"

export const comboboxParts = [
  "root",
  "clearTrigger",
  "content",
  "control",
  "empty",
  "errorIndicator",
  "errorText",
  "hint",
  "input",
  "item",
  "itemGroup",
  "itemGroupLabel",
  "itemIndicator",
  "itemText",
  "label",
  "positioner",
  "trigger",
] as const

export const comboboxAnatomy: Anatomy<
  "combobox",
  (typeof comboboxParts)[number]
> = createAnatomy("combobox").parts(...comboboxParts)
