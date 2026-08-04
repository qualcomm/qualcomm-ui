// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Anatomy, createAnatomy} from "@qualcomm-ui/utils/anatomy"

const parts = ["root", "icon"] as const

export const buttonAnatomy: Anatomy<"button", (typeof parts)[number]> =
  createAnatomy("button").parts(...parts)
