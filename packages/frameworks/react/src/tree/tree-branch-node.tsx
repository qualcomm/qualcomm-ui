// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreTree,
  type CoreTreeBranchNodeProps,
} from "@qualcomm-ui/react-core/tree"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsTreeContext} from "./qds-tree-context"

export interface TreeBranchNodeProps extends CoreTreeBranchNodeProps {}

/**
 * An interactive tree item with children. Renders a `<div>` element by default.
 */
export function TreeBranchNode(props: TreeBranchNodeProps): ReactElement {
  const qdsContext = useQdsTreeContext()
  const mergedProps = mergeProps(qdsContext.getBranchNodeBindings(), props)

  return <CoreTree.BranchNode {...mergedProps} />
}
