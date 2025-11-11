// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  filePathToTree,
  type FilePathTreeNode,
  TreeCollection,
  type TreeCollectionOptions,
  type TreeNode,
} from "@qualcomm-ui/utils/collection"

export function createTreeCollection<T = TreeNode>(
  options: TreeCollectionOptions<T>,
): TreeCollection<T> {
  return new TreeCollection(options)
}

export function filePathCollection(
  paths: string[],
): TreeCollection<FilePathTreeNode> {
  return filePathToTree(paths)
}
