// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Anatomy, createAnatomy} from "@qualcomm-ui/utils/anatomy"

export const radioParts = [
  "group",
  "label",
  "items",
  "item",
  "itemControl",
  "itemHiddenInput",
  "itemHint",
  "itemLabel",
  "hint",
  "errorText",
] as const

export const radioAnatomy: Anatomy<"radio", (typeof radioParts)[number]> =
  createAnatomy("radio").parts(...radioParts)
