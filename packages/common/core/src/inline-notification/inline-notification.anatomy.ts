// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Anatomy, createAnatomy} from "@qualcomm-ui/utils/anatomy"

export const inlineNotificationParts = [
  "root",
  "statusIcon",
  "heading",
  "description",
  "action",
  "closeTrigger",
] as const

export const inlineNotificationAnatomy: Anatomy<
  "inlineNotification",
  (typeof inlineNotificationParts)[number]
> = createAnatomy("inlineNotification").parts(...inlineNotificationParts)
