// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {createCheckboxTreeFilterApi} from "@qualcomm-ui/core/filter-control"
import type {TreeFilterDefinition} from "@qualcomm-ui/core/filters"
import {useFilter} from "@qualcomm-ui/react-core/filter-set"
import {Tree, type TreeRootProps} from "@qualcomm-ui/react/tree"

import {FilterOptionLabel} from "./internal/filter-option-label.js"
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
  const api = createCheckboxTreeFilterApi(useFilter<TreeFilterDefinition>())
  const qdsContext = useQdsFilterControlContext()
  const {tree} = api

  if (!tree) {
    return null
  }

  return (
    <Tree.Root
      {...api.getLabelProps()}
      checkedValue={api.checkedValue}
      collection={tree}
      onCheckedValueChange={({checkedValue}) =>
        api.setCheckedValue(checkedValue)
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
              <Tree.NodeText>
                <FilterOptionLabel
                  count={api.getOptionCount(tree.getNodeValue(node))}
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
