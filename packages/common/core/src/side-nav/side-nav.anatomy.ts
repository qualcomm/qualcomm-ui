// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Anatomy, createAnatomy} from "@qualcomm-ui/utils/anatomy"

export const sideNavParts = [
  "filterInput",
  "header",
  "headerAction",
  "headerLogo",
  "headerTitle",
  "root",
  "trigger",
] as const

export const sideNavAnatomy: Anatomy<"sideNav", (typeof sideNavParts)[number]> =
  createAnatomy("sideNav").parts(...sideNavParts)
