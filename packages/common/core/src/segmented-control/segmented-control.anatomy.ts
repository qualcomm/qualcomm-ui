// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Anatomy, createAnatomy} from "@qualcomm-ui/utils/anatomy"

export const segmentedControlParts = ["group"] as const

export const segmentedControlAnatomy: Anatomy<
  "segmentedControl",
  (typeof segmentedControlParts)[number]
> = createAnatomy("segmentedControl").parts(...segmentedControlParts)
