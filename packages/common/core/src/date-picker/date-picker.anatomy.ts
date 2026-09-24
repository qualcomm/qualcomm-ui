// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Anatomy, createAnatomy} from "@qualcomm-ui/utils/anatomy"

export const datePickerParts = [
  "root",
  "clearTrigger",
  "content",
  "control",
  "errorIndicator",
  "errorText",
  "hiddenInput",
  "hint",
  "input",
  "label",
  "nextTrigger",
  "positioner",
  "presets",
  "presetsTrigger",
  "presetTrigger",
  "prevTrigger",
  "rangeText",
  "table",
  "tableBody",
  "tableCell",
  "tableCellTrigger",
  "tableHead",
  "tableHeader",
  "tableRow",
  "trigger",
  "view",
  "viewCloseTrigger",
  "viewControl",
  "viewTrigger",
] as const

export const datePickerAnatomy: Anatomy<
  "datePicker",
  (typeof datePickerParts)[number]
> = createAnatomy("datePicker").parts(...datePickerParts)
