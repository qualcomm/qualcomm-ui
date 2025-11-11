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
