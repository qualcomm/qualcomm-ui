// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Anatomy, createAnatomy} from "@qualcomm-ui/utils/anatomy"

export const fieldsetParts = ["root", "legend", "hint", "errorText"] as const

export const fieldsetAnatomy: Anatomy<
  "fieldset",
  (typeof fieldsetParts)[number]
> = createAnatomy("fieldset").parts(...fieldsetParts)
