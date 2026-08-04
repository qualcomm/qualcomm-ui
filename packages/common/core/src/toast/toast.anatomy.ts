// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Anatomy, createAnatomy} from "@qualcomm-ui/utils/anatomy"

export const toastParts = [
  "group",
  "root",
  "label",
  "description",
  "actionTrigger",
  "closeTrigger",
  "ghostBefore",
  "ghostAfter",
] as const

export const toastAnatomy: Anatomy<"toast", (typeof toastParts)[number]> =
  createAnatomy("toast").parts(...toastParts)
