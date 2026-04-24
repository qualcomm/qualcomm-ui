// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Anatomy, createAnatomy} from "@qualcomm-ui/utils/anatomy"

const parts = [
  "root",
  "statusIcon",
  "heading",
  "description",
  "action",
  "closeButton",
] as const

export const alertBannerAnatomy: Anatomy<
  "alertBanner",
  (typeof parts)[number]
> = createAnatomy("alertBanner").parts(...parts)
