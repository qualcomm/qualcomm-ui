// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {ChevronRight} from "lucide-react"

import {IconOrNode} from "@qualcomm-ui/react/icon"
import type {LucideIconOrNode} from "@qualcomm-ui/react-core/lucide"
import {
  CoreTree,
  type CoreTreeBranchTriggerProps,
} from "@qualcomm-ui/react-core/tree"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsTreeContext} from "./qds-tree-context"

export interface TreeBranchTriggerProps extends CoreTreeBranchTriggerProps {
  /**
   * @default ChevronRight
   */
  icon?: LucideIconOrNode
}

/**
 * Action that indicates whether a branch is expanded or collapsed. Renders a `<div>`
 * element by default.
 */
export function TreeBranchTrigger({
  icon = ChevronRight,
  ...props
}: TreeBranchTriggerProps): ReactElement {
  const qdsContext = useQdsTreeContext()
  const mergedProps = mergeProps(qdsContext.getBranchTriggerBindings(), props)

  return (
    <CoreTree.BranchTrigger {...mergedProps}>
      <IconOrNode icon={icon} />
    </CoreTree.BranchTrigger>
  )
}
