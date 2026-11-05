// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Anatomy, createAnatomy} from "@qualcomm-ui/utils/anatomy"

export const fileUploadParts = [
  "root",
  "label",
  "hiddenInput",
  "trigger",
  "clearTrigger",
  "dropzone",
  "errorText",
  "itemGroup",
  "item",
  "itemName",
  "itemPreview",
  "itemPreviewImage",
  "itemSizeText",
  "itemDeleteTrigger",
] as const

export const fileUploadAnatomy: Anatomy<
  "fileUpload",
  (typeof fileUploadParts)[number]
> = createAnatomy("fileUpload").parts(...fileUploadParts)
