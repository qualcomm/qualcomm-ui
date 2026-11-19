// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import type {TreeFilterDefinition} from "@qualcomm-ui/core/filters"
import {Tree, type TreeRootProps} from "@qualcomm-ui/react/tree"
import {TreeCollection} from "@qualcomm-ui/utils/collection"

import {
  FilterCollectionStatus,
  type FilterCollectionStatusTextProps,
} from "./internal/filter-collection-status.js"
import {
  getFilterLabelProps,
  useFilterWidget,
} from "./internal/use-filter-widget.js"
import {useQdsFilterControlContext} from "./qds-filter-control-context.js"

export interface CheckboxTreeFilterProps
  extends
    Omit<
      TreeRootProps,
      | "checkedValue"
      | "children"
      | "collection"
      | "defaultCheckedValue"
      | "onCheckedValueChange"
    >,
    FilterCollectionStatusTextProps {}

/**
 * A tree with a checkbox on every node of the filter's tree collection.
 * Checking a branch checks its leaves. Writes the checked leaf values as a
 * `string[]`. Selected values missing from the tree are kept but not shown.
 */
export function CheckboxTreeFilter({
  loadErrorText,
  loadingText,
  retryLabel,
  ...props
}: CheckboxTreeFilterProps): ReactElement {
  const filter = useFilterWidget<TreeFilterDefinition>(
    "CheckboxTreeFilter",
    "tree",
  )
  const qdsContext = useQdsFilterControlContext()
  const state = filter.collectionState
  const tree =
    state?.collection instanceof TreeCollection ? state.collection : undefined

  const status = (
    <FilterCollectionStatus
      loadErrorText={loadErrorText}
      loadingText={loadingText}
      retryLabel={retryLabel}
      state={state}
    />
  )

  if (!tree) {
    return status
  }

  return (
    <>
      {status}
      <Tree.Root
        {...getFilterLabelProps(filter)}
        aria-busy={state?.status === "loading" || undefined}
        checkedValue={filter.value ?? []}
        collection={tree}
        onCheckedValueChange={({checkedValue}) => filter.setValue(checkedValue)}
        size={qdsContext.size}
        {...props}
      >
        {tree.getNodeChildren(tree.rootNode).map((node, index) => (
          <Tree.Nodes
            key={tree.getNodeValue(node)}
            indexPath={[index]}
            node={node}
            renderBranch={({node}) => (
              <Tree.BranchNode>
                <Tree.BranchTrigger />
                <Tree.NodeCheckbox />
                <Tree.NodeText>{tree.stringifyNode(node)}</Tree.NodeText>
              </Tree.BranchNode>
            )}
            renderLeaf={({node}) => (
              <Tree.LeafNode>
                <Tree.NodeCheckbox />
                <Tree.NodeText>{tree.stringifyNode(node)}</Tree.NodeText>
              </Tree.LeafNode>
            )}
          />
        ))}
      </Tree.Root>
    </>
  )
}
