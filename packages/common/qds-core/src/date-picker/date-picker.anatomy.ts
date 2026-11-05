// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Anatomy, createAnatomy} from "@qualcomm-ui/utils/anatomy"

const parts = [
  "actions",
  "controlGroup",
  "divider",
  "headline",
  "headlineLabel",
  "headlineValue",
  "inputGroup",
  "inputIcon",
  "rangeSeparator",
  "valueTags",
] as const

export const qdsDatePickerAnatomy: Anatomy<
  "datePicker",
  (typeof parts)[number]
> = createAnatomy("datePicker").parts(...parts)
