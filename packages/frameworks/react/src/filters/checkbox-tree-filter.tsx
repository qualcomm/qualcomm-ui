// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import type {TreeFilterDefinition} from "@qualcomm-ui/core/filters"
import {Tree, type TreeRootProps} from "@qualcomm-ui/react/tree"
import {TreeCollection} from "@qualcomm-ui/utils/collection"

import {FilterOptionLabel} from "./internal/filter-option-label.js"
import {getOptionCount} from "./internal/get-option-count.js"
import {
  getFilterLabelProps,
  useFilterWidget,
} from "./internal/use-filter-widget.js"
import {useQdsFilterControlContext} from "./qds-filter-control-context.js"

export interface CheckboxTreeFilterProps extends Omit<
  TreeRootProps,
  | "checkedValue"
  | "children"
  | "collection"
  | "defaultCheckedValue"
  | "onCheckedValueChange"
> {}

/**
 * A tree with a checkbox on every node of the filter's tree collection.
 * Checking a branch checks its leaves. Writes the checked leaf values as a
 * `string[]`. Selected values missing from the tree are kept but not shown.
 * Leaves show their result count when the filter has option counts. Renders
 * nothing while the filter has no tree.
 */
export function CheckboxTreeFilter(
  props: CheckboxTreeFilterProps,
): ReactElement | null {
  const filter = useFilterWidget<TreeFilterDefinition>(
    "CheckboxTreeFilter",
    "tree",
  )
  const qdsContext = useQdsFilterControlContext()
  const tree =
    filter.collection instanceof TreeCollection ? filter.collection : undefined

  if (!tree) {
    return null
  }

  return (
    <Tree.Root
      {...getFilterLabelProps(filter)}
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
              <Tree.NodeText>
                <FilterOptionLabel
                  count={getOptionCount(
                    filter.optionCounts,
                    tree.getNodeValue(node),
                  )}
                  label={tree.stringifyNode(node)}
                />
              </Tree.NodeText>
            </Tree.LeafNode>
          )}
        />
      ))}
    </Tree.Root>
  )
}
