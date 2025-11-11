// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, type ReactNode, useMemo} from "react"

import type {NodeProps} from "@qualcomm-ui/core/tree"
import {
  TreeNodePropsContextProvider,
  TreeNodeStateContextProvider,
  useTreeContext,
} from "@qualcomm-ui/react-core/tree"
import type {TreeNode} from "@qualcomm-ui/utils/collection"

export interface SideNavNodeProviderProps<T> extends NodeProps<T> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function SideNavNodeProvider<T extends TreeNode = TreeNode>({
  children,
  indexPath,
  node,
}: SideNavNodeProviderProps<T>): ReactElement {
  const treeContext = useTreeContext()
  const nodeProps = useMemo(
    () => ({
      indexPath,
      node,
    }),
    [indexPath, node],
  )
  const nodeState = useMemo(
    () => treeContext.getNodeState(nodeProps),
    [nodeProps, treeContext],
  )
  return (
    <TreeNodeStateContextProvider value={nodeState}>
      <TreeNodePropsContextProvider value={nodeProps}>
        {children}
      </TreeNodePropsContextProvider>
    </TreeNodeStateContextProvider>
  )
}
