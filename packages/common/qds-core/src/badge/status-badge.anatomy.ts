// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Anatomy, createAnatomy} from "@qualcomm-ui/utils/anatomy"

const parts = ["root"] as const

export const statusBadgeAnatomy: Anatomy<
  "statusBadge",
  (typeof parts)[number]
> = createAnatomy("statusBadge").parts(...parts)
