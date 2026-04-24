// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Anatomy, createAnatomy} from "@qualcomm-ui/utils/anatomy"

const parts = ["root", "startIcon", "endIcon", "dismissButton"] as const

export const tagAnatomy: Anatomy<"tag", (typeof parts)[number]> = createAnatomy(
  "tag",
).parts(...parts)
