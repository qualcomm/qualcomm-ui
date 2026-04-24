// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Anatomy, createAnatomy} from "@qualcomm-ui/utils/anatomy"

export const collapsibleParts = ["root", "trigger", "content"] as const

export const collapsibleAnatomy: Anatomy<
  "collapsible",
  (typeof collapsibleParts)[number]
> = createAnatomy("collapsible").parts(...collapsibleParts)
