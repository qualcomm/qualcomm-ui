// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {treeClasses} from "./tree.classes"

export type QdsTreeSize = "sm" | "md"

export interface QdsTreeApiProps {
  /**
   * The size of the tree and its elements. Governs properties like font size,
   * item padding, and icon sizes.
   *
   * @default 'md'
   */
  size?: QdsTreeSize
}

type TreeClasses = typeof treeClasses

export interface QdsTreeRootBindings {
  className: TreeClasses["root"]
  "data-size": QdsTreeSize
}

export interface QdsTreeLabelBindings {
  className: TreeClasses["label"]
  "data-size": QdsTreeSize
}

export interface QdsTreeBranchBindings {
  className: TreeClasses["branch"]
}

export interface QdsTreeBranchContentBindings {
  className: TreeClasses["branchContent"]
}

export interface QdsTreeBranchNodeBindings {
  className: TreeClasses["nodeRoot"]
  "data-size": QdsTreeSize
}

export interface QdsTreeBranchIndentGuideBindings {
  className: TreeClasses["branchIndentGuide"]
}

export interface QdsTreeBranchTriggerBindings {
  className: TreeClasses["branchTrigger"]
}

export interface QdsTreeLeafNodeBindings {
  className: TreeClasses["nodeRoot"]
  "data-size": QdsTreeSize
}

export interface QdsTreeNodeIndicatorBindings {
  className: TreeClasses["nodeIndicator"]
}

export interface QdsTreeNodeActionBindings {
  className: TreeClasses["nodeAction"]
}

export interface QdsTreeNodeIconBindings {
  className: TreeClasses["nodeIcon"]
  "data-size": QdsTreeSize
}

export interface QdsTreeApi {
  size: QdsTreeSize

  // group: bindings
  getBranchBindings(): QdsTreeBranchBindings
  getBranchContentBindings(): QdsTreeBranchContentBindings
  getBranchIndentGuideBindings(): QdsTreeBranchIndentGuideBindings
  getBranchNodeBindings(): QdsTreeBranchNodeBindings
  getBranchTriggerBindings(): QdsTreeBranchTriggerBindings
  getLabelBindings(): QdsTreeLabelBindings
  getLeafNodeBindings(): QdsTreeLeafNodeBindings
  getNodeActionBindings(): QdsTreeNodeActionBindings
  getNodeIconBindings(): QdsTreeNodeIconBindings
  getNodeIndicatorBindings(): QdsTreeNodeIndicatorBindings
  getRootBindings(): QdsTreeRootBindings
}
