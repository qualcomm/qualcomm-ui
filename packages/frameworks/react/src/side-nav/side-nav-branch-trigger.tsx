// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {ChevronDown} from "lucide-react"

import {IconOrNode} from "@qualcomm-ui/react/icon"
import type {LucideIconOrNode} from "@qualcomm-ui/react-core/lucide"
import {CoreTree, type CoreTreeBranchTriggerProps} from "@qualcomm-ui/react-core/tree"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {qdsSideNavApi} from "./qds-side-nav-context"

export interface SideNavBranchTriggerProps extends CoreTreeBranchTriggerProps {
  /**
   * The icon to display. This rotates by 180deg when the branch is expanded.
   *
   * @default ChevronDown
   */
  icon?: LucideIconOrNode
}

/**
 * Icon that indicates whether a branch is expanded or collapsed. Renders a `<div>`
 * element by default.
 */
export function SideNavBranchTrigger({
  icon = ChevronDown,
  ...props
}: SideNavBranchTriggerProps): ReactElement {
  const mergedProps = mergeProps(
    qdsSideNavApi.getBranchTriggerBindings(),
    props,
  )

  return (
    <CoreTree.BranchTrigger {...mergedProps}>
      <IconOrNode icon={icon} />
    </CoreTree.BranchTrigger>
  )
}
