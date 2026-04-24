// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Anatomy, createAnatomy} from "@qualcomm-ui/utils/anatomy"

export const inputParts = [
  "root",
  "label",
  "counter",
  "errorText",
  "hint",
  "inputGroup",
  "errorIndicator",
  "input",
  "clearTrigger",
] as const

export const inputAnatomy: Anatomy<"input", (typeof inputParts)[number]> =
  createAnatomy("input").parts(...inputParts)
