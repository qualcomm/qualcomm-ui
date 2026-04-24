// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Anatomy, createAnatomy} from "@qualcomm-ui/utils/anatomy"

export const textAreaParts = [
  "root",
  "label",
  "input",
  "counter",
  "errorText",
  "hint",
] as const

export const textAreaAnatomy: Anatomy<
  "textArea",
  (typeof textAreaParts)[number]
> = createAnatomy("textArea").parts(...textAreaParts)
