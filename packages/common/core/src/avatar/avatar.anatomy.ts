// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Anatomy, createAnatomy} from "@qualcomm-ui/utils/anatomy"

export const avatarParts = ["root", "image", "content", "status"] as const

export const avatarAnatomy: Anatomy<"avatar", (typeof avatarParts)[number]> =
  createAnatomy("avatar").parts(...avatarParts)
