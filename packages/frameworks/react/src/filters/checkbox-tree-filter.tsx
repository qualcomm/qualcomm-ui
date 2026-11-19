// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import type {OptionFilterDefinition} from "@qualcomm-ui/core/filters"
import {Tree, type TreeRootProps} from "@qualcomm-ui/react/tree"
import type {TreeCollection, TreeNode} from "@qualcomm-ui/utils/collection"

import {
  getFilterLabelProps,
  useFilterWidget,
} from "./internal/use-filter-widget.js"
import {useQdsFilterControlContext} from "./qds-filter-control-context.js"

export interface CheckboxTreeFilterProps<
  T extends TreeNode = TreeNode,
> extends Omit<
  TreeRootProps<T>,
  | "checkedValue"
  | "children"
  | "collection"
  | "defaultCheckedValue"
  | "onCheckedValueChange"
> {
  /**
   * The tree to render. Checked leaf values are written to the filter. The
   * definition's `options` are ignored.
   */
  collection: TreeCollection<T>
}

/**
 * A tree with a checkbox on every node. Checking a branch checks its leaves.
 * Writes the checked leaf values as a `string[]`.
 */
export function CheckboxTreeFilter<T extends TreeNode = TreeNode>({
  collection,
  ...props
}: CheckboxTreeFilterProps<T>): ReactElement {
  const filter = useFilterWidget<OptionFilterDefinition>(
    "CheckboxTreeFilter",
    "option",
  )
  const tree = collection as TreeCollection<any>
  const qdsContext = useQdsFilterControlContext()

  return (
    <Tree.Root
      {...getFilterLabelProps(filter)}
      checkedValue={filter.value ?? []}
      collection={collection}
      onCheckedValueChange={({checkedValue}) =>
        filter.setValue(checkedValue, {
          labels: Object.fromEntries(
            checkedValue.map((value) => [
              value,
              collection.stringify(value) ?? value,
            ]),
          ),
        })
      }
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
  )
}
