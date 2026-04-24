// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Anatomy, createAnatomy} from "@qualcomm-ui/utils/anatomy"

export const textInputParts = [
  "root",
  "label",
  "input",
  "inputGroup",
  "clearTrigger",
  "errorIndicator",
  "errorText",
  "hint",
] as const

export const textInputAnatomy: Anatomy<
  "textInput",
  (typeof textInputParts)[number]
> = createAnatomy("textInput").parts(...textInputParts)
