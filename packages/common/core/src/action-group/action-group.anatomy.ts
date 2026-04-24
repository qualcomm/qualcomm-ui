// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Anatomy, createAnatomy} from "@qualcomm-ui/utils/anatomy"

export const actionGroupParts = ["root"] as const

export const actionGroupAnatomy: Anatomy<
  "actionGroup",
  (typeof actionGroupParts)[number]
> = createAnatomy("actionGroup").parts(...actionGroupParts)
