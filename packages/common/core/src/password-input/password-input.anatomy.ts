// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Anatomy, createAnatomy} from "@qualcomm-ui/utils/anatomy"

export const passwordInputParts = [
  "root",
  "label",
  "input",
  "inputGroup",
  "clearTrigger",
  "errorIndicator",
  "errorText",
  "hint",
  "visibilityTrigger",
] as const

export const passwordInputAnatomy: Anatomy<
  "passwordInput",
  (typeof passwordInputParts)[number]
> = createAnatomy("passwordInput").parts(...passwordInputParts)
