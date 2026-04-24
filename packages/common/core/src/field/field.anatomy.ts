// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Anatomy, createAnatomy} from "@qualcomm-ui/utils/anatomy"

export const fieldParts = [
  "root",
  "label",
  "hint",
  "control",
  "errorText",
  "requiredIndicator",
] as const

export const fieldAnatomy: Anatomy<"field", (typeof fieldParts)[number]> =
  createAnatomy("field").parts(...fieldParts)
