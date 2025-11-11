// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {
  TreeBranchBindings,
  TreeBranchContentBindings,
} from "@qualcomm-ui/core/tree"
import type {CoreCollapsibleRootProps} from "@qualcomm-ui/react-core/collapsible"
import {useRenderStrategyPropsContext} from "@qualcomm-ui/react-core/presence"

import {useTreeContext} from "./tree-context"
import {
  useTreeNodePropsContext,
  useTreeNodeStateContext,
} from "./tree-node-context"

export function useTreeBranch(): CoreCollapsibleRootProps & TreeBranchBindings {
  const treeContext = useTreeContext()
  const nodeProps = useTreeNodePropsContext()
  const nodeState = useTreeNodeStateContext()
  const renderStrategyProps = useRenderStrategyPropsContext()

  return {
    open: nodeState.expanded,
    ...renderStrategyProps,
    ...treeContext.getBranchBindings(nodeProps),
  }
}

export function useTreeBranchContent(): TreeBranchContentBindings {
  const treeContext = useTreeContext()
  const nodeProps = useTreeNodePropsContext()

  return treeContext.getBranchContentBindings(nodeProps)
}
