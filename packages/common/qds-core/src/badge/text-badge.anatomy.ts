// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Anatomy, createAnatomy} from "@qualcomm-ui/utils/anatomy"

const parts = ["root"] as const

export const textBadgeAnatomy: Anatomy<"textBadge", (typeof parts)[number]> =
  createAnatomy("textBadge").parts(...parts)
