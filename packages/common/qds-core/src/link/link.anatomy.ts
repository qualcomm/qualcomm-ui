// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Anatomy, createAnatomy} from "@qualcomm-ui/utils/anatomy"

const parts = ["root", "icon"] as const

export const linkAnatomy: Anatomy<"link", (typeof parts)[number]> =
  createAnatomy("link").parts(...parts)
