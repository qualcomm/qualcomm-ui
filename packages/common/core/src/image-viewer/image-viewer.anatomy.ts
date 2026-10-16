// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Anatomy, createAnatomy} from "@qualcomm-ui/utils/anatomy"

export const imageViewerParts = [
  "root",
  "viewport",
  "image",
  "zoomInTrigger",
  "zoomOutTrigger",
  "resetTrigger",
] as const

export const imageViewerAnatomy: Anatomy<
  "imageViewer",
  (typeof imageViewerParts)[number]
> = createAnatomy("imageViewer").parts(...imageViewerParts)
