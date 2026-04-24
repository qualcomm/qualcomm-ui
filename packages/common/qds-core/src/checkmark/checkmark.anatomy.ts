// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Anatomy, createAnatomy} from "@qualcomm-ui/utils/anatomy"

const parts = ["root", "icon", "indicatorIcon"] as const

export const checkmarkAnatomy: Anatomy<"checkmark", (typeof parts)[number]> =
  createAnatomy("checkmark").parts(...parts)
