// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Anatomy, createAnatomy} from "@qualcomm-ui/utils/anatomy"

export const paginationParts = [
  "root",
  "nextTrigger",
  "pageItem",
  "pageItems",
  "pageMetadata",
  "pageSize",
  "pageSizeLabel",
  "prevTrigger",
] as const

export const paginationAnatomy: Anatomy<
  "pagination",
  (typeof paginationParts)[number]
> = createAnatomy("pagination").parts(...paginationParts)
