// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Anatomy, createAnatomy} from "@qualcomm-ui/utils/anatomy"

export const tourParts = [
  "content",
  "actionTrigger",
  "closeTrigger",
  "progressText",
  "heading",
  "description",
  "positioner",
  "arrow",
  "arrowTip",
  "backdrop",
  "spotlight",
] as const

export const tourAnatomy: Anatomy<"tour", (typeof tourParts)[number]> =
  createAnatomy("tour").parts(...tourParts)
