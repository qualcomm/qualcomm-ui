// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Anatomy, createAnatomy} from "@qualcomm-ui/utils/anatomy"

const parts = [
  "root",
  "media",
  "avatar",
  "badge",
  "content",
  "heading",
  "headingText",
  "subheadingText",
  "paragraphText",
  "eyebrowText",
  "menuTrigger",
  "footer",
  "button",
  "link",
] as const

export const cardAnatomy: Anatomy<"card", (typeof parts)[number]> =
  createAnatomy("card").parts(...parts)
