// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Explicit} from "@qualcomm-ui/utils/guard"
import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {treeClasses} from "./tree.classes"
import type {
  QdsTreeApi,
  QdsTreeApiProps,
  QdsTreeBranchBindings,
  QdsTreeBranchContentBindings,
  QdsTreeBranchIndentGuideBindings,
  QdsTreeBranchNodeBindings,
  QdsTreeBranchTriggerBindings,
  QdsTreeLabelBindings,
  QdsTreeLeafNodeBindings,
  QdsTreeNodeActionBindings,
  QdsTreeNodeIconBindings,
  QdsTreeNodeIndicatorBindings,
  QdsTreeRootBindings,
} from "./tree.types"

export function createQdsTreeApi(
  props: Explicit<QdsTreeApiProps>,
  normalize: PropNormalizer,
): QdsTreeApi {
  const size = props.size || "md"

  return {
    size,

    // group: bindings
    getBranchBindings(): QdsTreeBranchBindings {
      return normalize.element({
        className: treeClasses.branch,
      })
    },
    getBranchContentBindings(): QdsTreeBranchContentBindings {
      return normalize.element({
        className: treeClasses.branchContent,
      })
    },
    getBranchIndentGuideBindings(): QdsTreeBranchIndentGuideBindings {
      return normalize.element({
        className: treeClasses.branchIndentGuide,
      })
    },
    getBranchNodeBindings(): QdsTreeBranchNodeBindings {
      return normalize.element({
        className: treeClasses.nodeRoot,
        "data-size": size,
      })
    },
    getBranchTriggerBindings(): QdsTreeBranchTriggerBindings {
      return normalize.element({
        className: treeClasses.branchTrigger,
      })
    },
    getLabelBindings(): QdsTreeLabelBindings {
      return normalize.element({
        className: treeClasses.label,
        "data-size": size,
      })
    },
    getLeafNodeBindings(): QdsTreeLeafNodeBindings {
      return normalize.element({
        className: treeClasses.nodeRoot,
        "data-size": size,
      })
    },
    getNodeActionBindings(): QdsTreeNodeActionBindings {
      return normalize.element({
        className: treeClasses.nodeAction,
      })
    },
    getNodeIconBindings(): QdsTreeNodeIconBindings {
      return normalize.element({
        className: treeClasses.nodeIcon,
        "data-size": size,
      })
    },
    getNodeIndicatorBindings(): QdsTreeNodeIndicatorBindings {
      return normalize.element({
        className: treeClasses.nodeIndicator,
      })
    },
    getRootBindings(): QdsTreeRootBindings {
      return normalize.element({
        className: treeClasses.root,
        "data-size": size,
      })
    },
  }
}
