export interface CollectionSearchState {
  keysSoFar: string
  timer: number
}

export interface CollectionSearchOptions {
  currentValue: string | null
  state: CollectionSearchState
  timeout?: number | undefined
}

export type CollectionItem = any

export interface ListCollectionMethods<
  T extends CollectionItem = CollectionItem,
> {
  /**
   * Function to determine if a node is disabled.
   */
  itemDisabled: (item: T) => boolean | undefined
  /**
   * Function to get the item's label.
   */
  itemLabel: (item: T) => string
  /**
   * Function to get the item's unique value.
   */
  itemValue: (item: T) => string
}

export interface ListCollectionOptions<
  T extends CollectionItem = CollectionItem,
> extends Partial<ListCollectionMethods<T>> {
  /**
   * Function to group items
   */
  groupBy?: ((item: T, index: number) => string) | undefined
  /**
   * Function to sort items
   */
  groupSort?:
    | ((a: string, b: string) => number)
    | string[]
    | "asc"
    | "desc"
    | undefined
  /**
   * The options of the select
   */
  items: Iterable<T> | Readonly<Iterable<T>>
}

export type IndexPath = number[]

export type ValuePath = string[]

export interface TreeCollectionAccessors<T> {
  /**
   * Property key for accessing a node's children.
   * @default "nodes"
   */
  nodeChildren: keyof T
  /**
   * Function to determine the count of a node's children.
   */
  nodeChildrenCount: (node: T) => number | undefined
  /**
   * Property key or function to determine if a node is disabled. When a string key
   * is provided, the value of node[key] determines the disabled state.
   *
   * @default "disabled"
   */
  nodeDisabled: keyof T | ((node: T) => boolean)
  /**
   * Property key or function for getting a node's text. When a string key
   * is provided, the value of node[key] is used.
   *
   * @default "text"
   */
  nodeText: keyof T | ((node: T) => string)
  /**
   * Property key or function for getting a node's value. When a string key
   * is provided, the value of node[key] is used.
   *
   * @default "value"
   */
  nodeValue: keyof T | ((node: T) => string)
}

export interface TreeCollectionOptions<T>
  extends Partial<TreeCollectionAccessors<T>> {
  /**
   * The root node of the tree
   * @inheritDoc
   */
  rootNode: T
}

export type TreeNode = NonNullable<any>

export type FilePathTreeNode<T = TreeNode> = T & {
  children?: FilePathTreeNode<T>[] | undefined
}

export interface FlatTreeNodeMeta {
  _children: number[] | undefined
  _index: number
  _parent: number | undefined
}

export type FlatTreeNode<T = TreeNode> = T & FlatTreeNodeMeta

export interface TreeSkipFnArgs<T> {
  indexPath: number[]
  node: T
  value: string
}

export type TreeSkipFn<T> = (args: TreeSkipFnArgs<T>) => boolean | void

export interface TreeSkipOptions<T> {
  skip?: TreeSkipFn<T> | undefined
}

export interface DescendantOptions {
  withBranch?: boolean
}

/**
 * @param a - The first group
 * @param b - The second group
 */
export type GroupChildrenSort<T = TreeNode> =
  | string[]
  | ((
      a: {items: {indexPath: IndexPath; node: T}[]; key: string},
      b: {items: {indexPath: IndexPath; node: T}[]; key: string},
    ) => number)

export type GroupedTreeNode<T = TreeNode> = {
  items: {indexPath: IndexPath; node: T}[]
  key: string
}

export interface GroupChildrenOpts<T = TreeNode> {
  groupBy: (node: T, index: number) => string
  parentIndexPath?: IndexPath
  /**
   * @inheritDoc
   */
  sortGroups?: string[] | GroupChildrenSort<T>
}
