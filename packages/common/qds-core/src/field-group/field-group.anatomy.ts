// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Anatomy, createAnatomy} from "@qualcomm-ui/utils/anatomy"

const parts = ["root", "label", "items", "hint", "errorText"] as const

export const fieldGroupAnatomy: Anatomy<"fieldGroup", (typeof parts)[number]> =
  createAnatomy("fieldGroup").parts(...parts)
