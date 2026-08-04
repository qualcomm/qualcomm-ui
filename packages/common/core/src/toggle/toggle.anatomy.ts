// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Anatomy, createAnatomy} from "@qualcomm-ui/utils/anatomy"

export const toggleParts = ["root", "indicator"] as const

export const toggleAnatomy: Anatomy<"toggle", (typeof toggleParts)[number]> =
  createAnatomy("toggle").parts(...toggleParts)
