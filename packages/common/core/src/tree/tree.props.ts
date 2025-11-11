// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {TreeNode} from "@qualcomm-ui/utils/collection"
import {createProps, createSplitProps} from "@qualcomm-ui/utils/object"

import type {NodeProps, TreeApiProps} from "./tree.types"

export const treeProps: (keyof TreeApiProps<TreeNode>)[] = createProps<
  TreeApiProps<TreeNode>
>()(
  "checkedValue",
  "collection",
  "defaultCheckedValue",
  "defaultExpandedValue",
  "defaultFocusedValue",
  "defaultSelectedValue",
  "dir",
  "expandOnClick",
  "expandedValue",
  "focusedValue",
  "getRootNode",
  "loadChildren",
  "onCheckedValueChange",
  "onExpandedValueChange",
  "onFocusChange",
  "onLoadChildrenComplete",
  "onLoadChildrenError",
  "onSelectedValueChange",
  "selectedValue",
  "selectionMode",
  "shouldHideNode",
  "typeahead",
)

export const splitTreeProps: <Props extends TreeApiProps<TreeNode>>(
  props: Props,
) => [TreeApiProps<TreeNode>, Omit<Props, keyof TreeApiProps<TreeNode>>] =
  createSplitProps<Partial<TreeApiProps<TreeNode>>>(treeProps)

export const treeItemProps: (keyof NodeProps)[] = createProps<NodeProps>()(
  "node",
  "indexPath",
)

export const splitTreeItemProps: <Props extends NodeProps>(
  props: Props,
) => [NodeProps, Omit<Props, keyof NodeProps>] =
  createSplitProps<NodeProps>(treeItemProps)
