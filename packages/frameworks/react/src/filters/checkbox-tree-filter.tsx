// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import type {CheckboxTreeFilterDefinition} from "@qualcomm-ui/core/filters"
import {useFilterPanelFilter} from "@qualcomm-ui/react-core/filter-panel"
import {useQdsFilterPanelContext} from "@qualcomm-ui/react/filter-panel"
import {Tree, type TreeRootProps} from "@qualcomm-ui/react/tree"
import type {TreeCollection, TreeNode} from "@qualcomm-ui/utils/collection"

import {FilterSection, type FilterSectionProps} from "./filter-section.js"

export interface CheckboxTreeFilterControlProps<
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
   * The tree to render. Checked leaf values are written to the filter.
   */
  collection: TreeCollection<T>
}

/**
 * A tree with a checkbox on every node. Checking a branch checks its leaves.
 */
export function CheckboxTreeFilterControl<T extends TreeNode = TreeNode>({
  collection,
  ...props
}: CheckboxTreeFilterControlProps<T>): ReactElement {
  const filter = useFilterPanelFilter<CheckboxTreeFilterDefinition>()
  const tree = collection as TreeCollection<any>
  const qdsContext = useQdsFilterPanelContext()

  return (
    <Tree.Root
      aria-labelledby={filter.labelId}
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
      size={qdsContext.controlSize}
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

export interface CheckboxTreeFilterProps<T extends TreeNode = TreeNode>
  extends
    FilterSectionProps<CheckboxTreeFilterDefinition>,
    Omit<CheckboxTreeFilterControlProps<T>, keyof FilterSectionProps> {}

/**
 * A filter that selects leaves of a tree with checkboxes. Writes the checked
 * leaf values as a `string[]`.
 */
export function CheckboxTreeFilter<T extends TreeNode = TreeNode>({
  contentProps,
  defaultOpen,
  filter,
  label,
  onOpenChange,
  open,
  rootProps,
  triggerProps,
  ...props
}: CheckboxTreeFilterProps<T>): ReactElement {
  return (
    <FilterSection
      contentProps={contentProps}
      defaultOpen={defaultOpen}
      filter={filter}
      label={label}
      onOpenChange={onOpenChange}
      open={open}
      rootProps={rootProps}
      triggerProps={triggerProps}
    >
      <CheckboxTreeFilterControl {...props} />
    </FilterSection>
  )
}
