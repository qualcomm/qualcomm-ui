// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Anatomy, createAnatomy} from "@qualcomm-ui/utils/anatomy"

export const treeParts = [
  "root",
  "label",
  "branch",
  "branchContent",
  "branchIndentGuide",
  "branchIndicator",
  "branchNode",
  "branchTrigger",
  "leafNode",
  "nodeAction",
  "nodeCheckbox",
  "nodeIcon",
  "nodeIndicator",
  "nodeText",
] as const

export const treeAnatomy: Anatomy<"tree", (typeof treeParts)[number]> =
  createAnatomy("tree").parts(...treeParts)
