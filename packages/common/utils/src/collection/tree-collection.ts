import {isEqual} from "@qualcomm-ui/utils/equal"
import {hasProp, isObject} from "@qualcomm-ui/utils/guard"

import {
  access,
  type CollectionTreeVisitOpts,
  compareIndexPaths,
  filter,
  find,
  findAll,
  findIndexPath,
  type FindOptions,
  flatMap,
  flatten,
  insert,
  move,
  remove,
  replace,
  visit,
} from "./tree-visit"
import type {
  DescendantOptions,
  FilePathTreeNode,
  FlatTreeNode,
  GroupedTreeNode,
  IndexPath,
  TreeCollectionAccessors,
  TreeCollectionOptions,
  TreeNode,
  TreeSkipOptions,
} from "./types"

export class TreeCollection<T> {
  /**
   * The root tree node.
   * @inheritDoc
   */
  rootNode: T

  constructor(private options: TreeCollectionOptions<T>) {
    this.rootNode = options.rootNode
  }

  /**
   * Compares this tree collection with another for deep equality.
   * @param other - The other tree collection to compare with
   *
   * @inheritDoc
   */
  isEqual: (other: TreeCollection<T>) => boolean = (
    other: TreeCollection<T>,
  ): boolean => {
    return isEqual(this.rootNode, other.rootNode)
  }

  /**
   * Returns all child nodes for this node.
   * Uses options.nodeToChildren if provided, otherwise falls back to default behavior.
   * @param node
   */
  getNodeChildren: (node: T) => T[] = (node: T): T[] => {
    return (
      getNodeProp(
        node,
        this.options.nodeChildren || fallbackAccessors.nodeChildren,
      ) ?? []
    )
  }

  private resolveIndexPath: (
    valueOrIndexPath: string | IndexPath,
  ) => IndexPath | undefined = (
    valueOrIndexPath: string | IndexPath,
  ): IndexPath | undefined => {
    return typeof valueOrIndexPath === "string"
      ? this.getIndexPath(valueOrIndexPath)
      : valueOrIndexPath
  }

  private resolveNode: (valueOrIndexPath: string | IndexPath) => T | undefined =
    (valueOrIndexPath: string | IndexPath): T | undefined => {
      const indexPath = this.resolveIndexPath(valueOrIndexPath)
      return indexPath ? this.at(indexPath) : undefined
    }

  /**
   * Gets the number of children for a node, supporting lazy loading scenarios.
   * Uses options.nodeToChildrenCount if provided, otherwise falls back to default behavior.
   * @param node - The node to get children count for
   */
  getNodeChildrenCount: (node: T) => number | undefined = (
    node: T,
  ): number | undefined => {
    return (
      this.options.nodeChildrenCount?.(node) ??
      fallbackAccessors.nodeChildrenCount(node)
    )
  }

  /**
   * Gets the string value for a node.
   * Uses options.nodeValue if provided, otherwise falls back to default behavior.
   * @param node - The node to get the value from
   */
  getNodeValue: (node: T) => string = (node): string => {
    return getNodeProp(
      node,
      this.options.nodeValue || fallbackAccessors.nodeValue,
    )
  }

  /**
   * Checks if a node is disabled.
   * Uses options.isNodeDisabled if provided, otherwise falls back to default behavior.
   * @param node - The node to check
   */
  getNodeDisabled: (node: T) => boolean = (node): boolean => {
    return getNodeProp(
      node,
      this.options.nodeDisabled || fallbackAccessors.nodeDisabled,
    )
  }

  /**
   * Converts a node value to its string representation.
   * @param value - The value to stringify
   */
  stringify = (value: string): string | null => {
    const node = this.findNode(value)
    if (!node) {
      return null
    }
    return this.stringifyNode(node)
  }

  /**
   * Converts a node to its string representation.
   * Uses options.nodeLabel if provided, otherwise falls back to default behavior: uses `node.text`, or `node.value` if `node.text` is not available.
   * @param node - The node to stringify
   */
  stringifyNode = (node: T): string => {
    return getNodeProp(
      node,
      this.options.nodeText || fallbackAccessors.nodeText,
    )
  }

  /**
   * Gets the first non-disabled node in the tree.
   * @param rootNode - The root node to start searching from
   */
  getFirstNode: (rootNode?: T) => T | undefined = (
    rootNode = this.rootNode,
  ) => {
    let firstChild: T | undefined
    visit(rootNode, {
      getChildren: this.getNodeChildren,
      onEnter: (node, indexPath) => {
        if (
          !firstChild &&
          indexPath.length > 0 &&
          !this.getNodeDisabled(node)
        ) {
          firstChild = node
          return "stop"
        }
      },
    })
    return firstChild
  }

  /**
   * Gets the last non-disabled node in the tree.
   * @param rootNode - The root node to start searching from
   * @param opts - Options for skipping nodes during traversal
   */
  getLastNode: (rootNode?: T, opts?: TreeSkipOptions<T>) => T | undefined = (
    rootNode = this.rootNode,
    opts = {},
  ): T | undefined => {
    let lastChild: T | undefined
    visit(rootNode, {
      getChildren: this.getNodeChildren,
      onEnter: (node, indexPath) => {
        if (this.isSameNode(node, rootNode)) {
          return
        }
        if (opts.skip?.({indexPath, node, value: this.getNodeValue(node)})) {
          return "skip"
        }
        if (indexPath.length > 0 && !this.getNodeDisabled(node)) {
          lastChild = node
        }
      },
    })
    return lastChild
  }

  /**
   * Gets the node at the specified index path.
   * @param indexPath - Array of indices representing the path to the node
   */
  at: (indexPath: IndexPath) => T | undefined = (indexPath) => {
    return access(this.rootNode, indexPath, {
      getChildren: this.getNodeChildren,
    })
  }

  /**
   * Finds the first node with the specified value.
   * @param value - The value to search for
   * @param rootNode - The root node to start searching from
   */
  findNode: (value: string, rootNode?: T) => T | undefined = (
    value,
    rootNode = this.rootNode,
  ) => {
    return find(rootNode, {
      getChildren: this.getNodeChildren,
      predicate: (node) => this.getNodeValue(node) === value,
    })
  }

  findNodeBy: (
    predicate: FindOptions<T>["predicate"],
    rootNode?: T,
  ) => T | undefined = (
    predicate: FindOptions<T>["predicate"],
    rootNode: T = this.rootNode,
  ): T | undefined => {
    return find(rootNode, {
      getChildren: this.getNodeChildren,
      predicate,
    })
  }

  /**
   * Finds all nodes with values matching the provided array.
   * @param values - Array of values to search for
   * @param rootNode - The root node to start searching from
   */
  findNodes: (values: string[], rootNode?: T) => T[] = (
    values,
    rootNode = this.rootNode,
  ) => {
    const v = new Set(values.filter((v) => v != null))
    return findAll(rootNode, {
      getChildren: this.getNodeChildren,
      predicate: (node) => v.has(this.getNodeValue(node)),
    })
  }

  /**
   * Sorts values according to their tree order.
   * @param values - Array of values to sort
   */
  sort: (values: string[]) => string[] = (values: string[]): string[] => {
    return values
      .reduce<Array<{indexPath: IndexPath; value: string}>>((acc, value) => {
        const indexPath = this.getIndexPath(value)
        if (indexPath) {
          acc.push({indexPath, value})
        }
        return acc
      }, [])
      .sort((a, b) => compareIndexPaths(a.indexPath, b.indexPath))
      .map(({value}) => value)
  }

  /**
   * Gets the index path for a node with the specified value.
   * @param value - The value to find the index path for
   */
  getIndexPath: (value: string) => IndexPath | undefined = (value) => {
    return findIndexPath(this.rootNode, {
      getChildren: this.getNodeChildren,
      predicate: (node) => this.getNodeValue(node) === value,
    })
  }

  /**
   * Gets the value of the node at the specified index path.
   * @param indexPath - Array of indices representing the path to the node
   */
  getValue: (indexPath: IndexPath) => string | undefined = (indexPath) => {
    const node = this.at(indexPath)
    return node ? this.getNodeValue(node) : undefined
  }

  /**
   * Gets the path of values from root to the specified index path.
   * @param indexPath - Array of indices representing the path to the node
   */
  getValuePath: (indexPath: IndexPath | undefined) => string[] = (
    indexPath,
  ) => {
    if (!indexPath) {
      return []
    }
    const valuePath: string[] = []
    const currentPath = [...indexPath]
    while (currentPath.length > 0) {
      const node = this.at(currentPath)
      if (node) {
        valuePath.unshift(this.getNodeValue(node))
      }
      currentPath.pop()
    }
    return valuePath
  }

  /**
   * Gets the depth of a node with the specified value.
   * @param value - The value to find the depth for
   */
  getDepth: (value: string) => number = (value: string) => {
    const indexPath = findIndexPath(this.rootNode, {
      getChildren: this.getNodeChildren,
      predicate: (node) => this.getNodeValue(node) === value,
    })
    return indexPath?.length ?? 0
  }

  /**
   * Checks if two nodes are the same by comparing their values.
   * @param node - First node to compare
   * @param other - Second node to compare
   */
  isSameNode: (node: T, other: T) => boolean = (node, other) => {
    return this.getNodeValue(node) === this.getNodeValue(other)
  }

  /**
   * Checks if a node is the root node.
   * @param node - The node to check
   */
  isRootNode: (node: T) => boolean = (node) => {
    return this.isSameNode(node, this.rootNode)
  }

  /**
   * Checks if a parent index path contains a child index path.
   * @param parentIndexPath - The parent path
   * @param valueIndexPath - The child path to check
   */
  contains: (parentIndexPath: IndexPath, valueIndexPath: IndexPath) => boolean =
    (parentIndexPath, valueIndexPath) => {
      if (!parentIndexPath || !valueIndexPath) {
        return false
      }
      return valueIndexPath
        .slice(0, parentIndexPath.length)
        .every((_, i) => parentIndexPath[i] === valueIndexPath[i])
    }

  /**
   * Gets the next node after the one with the specified value.
   * @param value - The value to find the next node from
   * @param opts - Options for skipping nodes during traversal
   */
  getNextNode: (value: string, opts?: TreeSkipOptions<T>) => T | undefined = (
    value,
    opts = {},
  ) => {
    let found = false
    let nextNode: T | undefined

    visit(this.rootNode, {
      getChildren: this.getNodeChildren,
      onEnter: (node, indexPath) => {
        if (this.isRootNode(node)) {
          return
        }
        const nodeValue = this.getNodeValue(node)
        if (opts.skip?.({indexPath, node, value: nodeValue})) {
          if (nodeValue === value) {
            found = true
          }
          return "skip"
        }
        if (found && !this.getNodeDisabled(node)) {
          nextNode = node
          return "stop"
        }
        if (nodeValue === value) {
          found = true
        }
      },
    })

    return nextNode
  }

  /**
   * Gets the previous node before the one with the specified value.
   * @param value - The value to find the previous node from
   * @param opts - Options for skipping nodes during traversal
   */
  getPreviousNode: (value: string, opts?: TreeSkipOptions<T>) => T | undefined =
    (value, opts = {}) => {
      let previousNode: T | undefined
      let found = false
      visit(this.rootNode, {
        getChildren: this.getNodeChildren,
        onEnter: (node, indexPath) => {
          if (this.isRootNode(node)) {
            return
          }
          const nodeValue = this.getNodeValue(node)

          if (opts.skip?.({indexPath, node, value: nodeValue})) {
            return "skip"
          }

          if (nodeValue === value) {
            found = true
            return "stop"
          }

          if (!this.getNodeDisabled(node)) {
            previousNode = node
          }
        },
      })
      return found ? previousNode : undefined
    }

  /**
   * Gets all parent nodes from root to the specified node.
   * @param valueOrIndexPath - Either a node value or index path
   */
  getParentNodes: (valueOrIndexPath: string | IndexPath) => T[] = (
    valueOrIndexPath,
  ) => {
    const indexPath = this.resolveIndexPath(valueOrIndexPath)?.slice()
    if (!indexPath) {
      return []
    }
    const result: T[] = []
    while (indexPath.length > 0) {
      indexPath.pop()
      const parentNode = this.at(indexPath)
      if (parentNode && !this.isRootNode(parentNode)) {
        result.unshift(parentNode)
      }
    }
    return result
  }

  /**
   * Gets all descendant nodes of the specified node.
   * @param valueOrIndexPath - Either a node value or index path
   * @param options - Options for controlling which descendants to include
   */
  getDescendantNodes: (
    valueOrIndexPath?: string | IndexPath,
    options?: DescendantOptions,
  ) => T[] = (valueOrIndexPath = [], options): T[] => {
    const parentNode = this.resolveNode(valueOrIndexPath)
    if (!parentNode) {
      return []
    }
    const result: T[] = []
    visit(parentNode, {
      getChildren: this.getNodeChildren,
      onEnter: (node, nodeIndexPath) => {
        if (nodeIndexPath.length === 0) {
          return
        }
        if (!options?.withBranch && this.isBranchNode(node)) {
          return
        }
        result.push(node)
      },
    })
    return result
  }

  /**
   * Gets all descendant values of the specified node.
   * @param valueOrIndexPath - Either a node value or index path
   * @param options - Options for controlling which descendants to include
   */
  getDescendantValues: (
    valueOrIndexPath: string | IndexPath,
    options?: DescendantOptions,
  ) => string[] = (valueOrIndexPath, options) => {
    const children = this.getDescendantNodes(valueOrIndexPath, options)
    return children.map((child) => this.getNodeValue(child))
  }

  private getParentIndexPath: (indexPath: IndexPath) => IndexPath = (
    indexPath,
  ) => {
    return indexPath.slice(0, -1)
  }

  /**
   * Gets the parent node of the specified node.
   * @param valueOrIndexPath - Either a node value or index path
   */
  getParentNode: (valueOrIndexPath: string | IndexPath) => T | undefined = (
    valueOrIndexPath,
  ) => {
    const indexPath = this.resolveIndexPath(valueOrIndexPath)
    return indexPath ? this.at(this.getParentIndexPath(indexPath)) : undefined
  }

  /**
   * Visits all nodes in the tree with optional skip functionality.
   * @param opts - Options for visiting nodes, including skip predicate
   */
  visit: (opts: CollectionTreeVisitOpts<T>) => void = (opts) => {
    const {skip, ...rest} = opts
    visit(this.rootNode, {
      ...rest,
      getChildren: this.getNodeChildren,
      onEnter: (node, indexPath) => {
        if (this.isRootNode(node)) {
          return
        }
        if (skip?.({indexPath, node, value: this.getNodeValue(node)})) {
          return "skip"
        }
        return rest.onEnter?.(node, indexPath)
      },
    })
  }

  /**
   * Gets the previous non-disabled sibling of the node at the index path.
   * @param indexPath - Array of indices representing the path to the node
   */
  getPreviousSibling: (indexPath: IndexPath) => T | undefined = (indexPath) => {
    const parentNode = this.getParentNode(indexPath)
    if (!parentNode) {
      return
    }
    const siblings = this.getNodeChildren(parentNode)
    let idx = indexPath[indexPath.length - 1]
    while (--idx >= 0) {
      const sibling = siblings[idx]
      if (!this.getNodeDisabled(sibling)) {
        return sibling
      }
    }
    return
  }

  /**
   * Gets the next non-disabled sibling of the node at the index path.
   * @param indexPath - Array of indices representing the path to the node
   */
  getNextSibling: (indexPath: IndexPath) => T | undefined = (
    indexPath: IndexPath,
  ): T | undefined => {
    const parentNode = this.getParentNode(indexPath)
    if (!parentNode) {
      return
    }
    const siblings = this.getNodeChildren(parentNode)
    let idx = indexPath[indexPath.length - 1]
    while (++idx < siblings.length) {
      const sibling = siblings[idx]
      if (!this.getNodeDisabled(sibling)) {
        return sibling
      }
    }
    return
  }

  /**
   * Gets all sibling nodes of the node at the index path.
   * @param indexPath - Array of indices representing the path to the node
   */
  getSiblingNodes: (indexPath: IndexPath) => T[] = (
    indexPath: IndexPath,
  ): T[] => {
    const parentNode = this.getParentNode(indexPath)
    return parentNode ? this.getNodeChildren(parentNode) : []
  }

  /**
   * Gets all values in the tree, excluding the root node.
   * @param rootNode - The root node to start from
   */
  getValues: (rootNode?: T) => string[] = (
    rootNode = this.rootNode,
  ): string[] => {
    const values = flatMap(rootNode, {
      getChildren: this.getNodeChildren,
      transform: (node) => [this.getNodeValue(node)],
    })
    // remove the root node
    return values.slice(1)
  }

  private isValidDepth: (
    indexPath: IndexPath,
    depth?: number | ((nodeDepth: number) => boolean),
  ) => boolean = (
    indexPath: IndexPath,
    depth?: number | ((nodeDepth: number) => boolean),
  ): boolean => {
    if (depth == null) {
      return true
    }
    if (typeof depth === "function") {
      return depth(indexPath.length)
    }
    return indexPath.length === depth
  }

  /**
   * Checks if a node is a branch node (has children or can have children).
   * @param node - The node to check
   */
  isBranchNode: (node: T) => boolean = (node: T): boolean => {
    return (
      this.getNodeChildren(node).length > 0 ||
      this.getNodeChildrenCount(node) != null
    )
  }

  /**
   * Gets all branch node values with optional depth filtering.
   * @param rootNode - The root node to start from
   * @param opts - Options for skipping nodes and filtering by depth
   */
  getBranchValues: (
    rootNode?: T,
    opts?: TreeSkipOptions<T> & {
      depth?: number | ((nodeDepth: number) => boolean) | undefined
    },
  ) => string[] = (
    rootNode = this.rootNode,
    opts: TreeSkipOptions<T> & {
      depth?: number | ((nodeDepth: number) => boolean) | undefined
    } = {},
  ): string[] => {
    const values: string[] = []
    visit(rootNode, {
      getChildren: this.getNodeChildren,
      onEnter: (node, indexPath) => {
        if (indexPath.length === 0) {
          return
        }
        const nodeValue = this.getNodeValue(node)
        if (opts.skip?.({indexPath, node, value: nodeValue})) {
          return "skip"
        }
        if (
          this.isBranchNode(node) &&
          this.isValidDepth(indexPath, opts.depth)
        ) {
          values.push(this.getNodeValue(node))
        }
      },
    })
    return values
  }

  /**
   * Flattens the tree into an array with parent/child relationships.
   * @param rootNode - The root node to start flattening from
   */
  flatten: (rootNode?: T) => Array<FlatTreeNode<T>> = (
    rootNode: T = this.rootNode,
  ): Array<FlatTreeNode<T>> => {
    return flatten(rootNode, {getChildren: this.getNodeChildren})
  }

  private _create: (node: T, children: T[]) => T = (node: T, children: T[]) => {
    // Only set children if the node originally had children or there are filtered
    // children
    if (this.getNodeChildren(node).length > 0 || children.length > 0) {
      return {
        ...node,
        [this.options.nodeChildren || fallbackAccessors.nodeChildren]: children,
      }
    }
    return {...node}
  }

  private _insert = (
    rootNode: T,
    indexPath: IndexPath,
    nodes: T[],
  ): TreeCollection<T> => {
    return this.copy(
      insert(rootNode, {
        at: indexPath,
        create: this._create,
        getChildren: this.getNodeChildren,
        nodes,
      }),
    )
  }

  /**
   * Creates a new tree collection with the same options but different root node.
   * @param rootNode - The new root node for the copied collection
   */
  copy: (rootNode: T) => TreeCollection<T> = (
    rootNode: T,
  ): TreeCollection<T> => {
    return new TreeCollection({...this.options, rootNode})
  }

  private _replace = (
    rootNode: T,
    indexPath: IndexPath,
    node: T,
  ): TreeCollection<T> => {
    return this.copy(
      replace(rootNode, {
        at: indexPath,
        create: this._create,
        getChildren: this.getNodeChildren,
        node,
      }),
    )
  }

  private _move = (
    rootNode: T,
    indexPaths: IndexPath[],
    to: IndexPath,
  ): TreeCollection<T> => {
    return this.copy(
      move(rootNode, {
        create: this._create,
        getChildren: this.getNodeChildren,
        indexPaths,
        to,
      }),
    )
  }

  private _remove = (
    rootNode: T,
    indexPaths: IndexPath[],
  ): TreeCollection<T> => {
    return this.copy(
      remove(rootNode, {
        create: this._create,
        getChildren: this.getNodeChildren,
        indexPaths,
      }),
    )
  }

  /**
   * Replaces the node at the specified index path.
   * @param indexPath - Array of indices representing the path to the node
   * @param node - The new node to replace with
   */
  replace: (indexPath: IndexPath, node: T) => TreeCollection<T> = (
    indexPath: IndexPath,
    node: T,
  ): TreeCollection<T> => {
    return this._replace(this.rootNode, indexPath, node)
  }

  /**
   * Removes nodes at the specified index paths.
   * @param indexPaths - Array of index paths to remove
   */
  remove: (indexPaths: IndexPath[]) => TreeCollection<T> = (
    indexPaths: IndexPath[],
  ): TreeCollection<T> => {
    return this._remove(this.rootNode, indexPaths)
  }

  /**
   * Inserts nodes before the node at the specified index path.
   * @param indexPath - Array of indices representing the insertion point
   * @param nodes - Array of nodes to insert
   */
  insertBefore: (
    indexPath: IndexPath,
    nodes: T[],
  ) => TreeCollection<T> | undefined = (
    indexPath: IndexPath,
    nodes: T[],
  ): TreeCollection<T> | undefined => {
    const parentNode = this.getParentNode(indexPath)
    return parentNode
      ? this._insert(this.rootNode, indexPath, nodes)
      : undefined
  }

  /**
   * Inserts nodes after the node at the specified index path.
   * @param indexPath - Array of indices representing the insertion point
   * @param nodes - Array of nodes to insert
   */
  insertAfter: (
    indexPath: IndexPath,
    nodes: T[],
  ) => TreeCollection<T> | undefined = (
    indexPath: IndexPath,
    nodes: T[],
  ): TreeCollection<T> | undefined => {
    const parentNode = this.getParentNode(indexPath)
    if (!parentNode) {
      return
    }
    const nextIndex = [
      ...indexPath.slice(0, -1),
      indexPath[indexPath.length - 1] + 1,
    ]
    return this._insert(this.rootNode, nextIndex, nodes)
  }

  /**
   * Moves nodes from one location to another in the tree.
   * @param fromIndexPaths - Array of index paths to move from
   * @param toIndexPath - Index path to move to
   */
  move: (
    fromIndexPaths: IndexPath[],
    toIndexPath: IndexPath,
  ) => TreeCollection<T> = (
    fromIndexPaths: IndexPath[],
    toIndexPath: IndexPath,
  ): TreeCollection<T> => {
    return this._move(this.rootNode, fromIndexPaths, toIndexPath)
  }

  /**
   * Filters the tree keeping only nodes that match the predicate.
   * @param predicate - Function to test each node
   */
  filter: (
    predicate: (node: T, indexPath: IndexPath) => boolean,
  ) => TreeCollection<T> = (
    predicate: (node: T, indexPath: IndexPath) => boolean,
  ): TreeCollection<T> => {
    const filteredRoot = filter(this.rootNode, {
      create: this._create,
      getChildren: this.getNodeChildren,
      predicate,
    })
    return this.copy(filteredRoot)
  }

  /**
   * Groups children of a parent node by a specified key.
   * @param parentIndexPath - Index path of the parent node whose children to group. Pass `[]` for root-level children.
   * @param groupBy - Function that determines the group key for each child node
   * @param sortGroups - Optional array of group keys defining order, or comparator function to sort the groups. By default, groups are sorted by first occurrence in the tree (insertion order)
   * @returns Array of groups, each containing a key and array of items with node and indexPath
   * @example
   * ```ts
   * // Group root-level children
   * const groups = collection.groupChildren([], (node) => node.group ?? 'default')
   *
   * // Group with explicit order
   * const groups = collection.groupChildren(
   *   [],
   *   (node) => node.group,
   *   ['primary', 'secondary', 'tertiary']
   * )
   *
   * // Group with custom sorter
   * const groups = collection.groupChildren(
   *   [],
   *   (node) => node.group,
   *   (a, b) => String(a.key).localeCompare(String(b.key))
   * )
   * ```
   *
   * @inheritDoc
   */
  groupChildren: (
    parentIndexPath: IndexPath,
    groupBy: (node: T, index: number) => string,
    sortGroups?:
      | string[]
      | ((
          a: {items: {indexPath: IndexPath; node: T}[]; key: string},
          b: {items: {indexPath: IndexPath; node: T}[]; key: string},
        ) => number),
  ) => GroupedTreeNode<T>[] = (
    parentIndexPath,
    groupBy,
    sortGroups,
  ): GroupedTreeNode<T>[] => {
    const parentNode = this.at(parentIndexPath)
    if (!parentNode) {
      return []
    }

    const groupMap = new Map<string, Array<{indexPath: IndexPath; node: T}>>()
    const children = this.getNodeChildren(parentNode)

    children.forEach((node, index) => {
      const key = groupBy(node, index)
      const indexPath = [...parentIndexPath, index]
      const group = groupMap.get(key)
      if (!group) {
        groupMap.set(key, [{indexPath, node}])
      } else {
        group.push({indexPath, node})
      }
    })

    const groups = Array.from(groupMap.entries()).map(([key, items]) => ({
      items,
      key,
    }))

    if (!sortGroups) {
      return groups
    }

    if (Array.isArray(sortGroups)) {
      return groups.sort((a, b) => {
        const aIndex = sortGroups.indexOf(String(a.key))
        const bIndex = sortGroups.indexOf(String(b.key))
        const aOrder = aIndex === -1 ? Infinity : aIndex
        const bOrder = bIndex === -1 ? Infinity : bIndex
        return aOrder - bOrder
      })
    }

    return groups.sort(sortGroups)
  }

  /**
   * Serializes the tree to a JSON-compatible array of values.
   */
  toJSON: () => string[] = () => {
    return this.getValues(this.rootNode)
  }
}

/**
 * Converts a flattened array of nodes back into a tree structure.
 * @param nodes - Array of flattened tree nodes with parent/child relationships
 * @param options - Tree collection methods for handling nodes
 */
export function flattenedToTree<T extends TreeNode>(
  nodes: Array<FlatTreeNode<T>>,
  options: TreeCollectionAccessors<T> = fallbackAccessors,
): TreeCollection<T> {
  if (nodes.length === 0) {
    throw new Error(
      "[zag-js/tree] Cannot create tree from empty flattened array",
    )
  }

  // Find the actual root node (the one with _parent === undefined)
  const rootFlatNode = nodes.find((node) => node._parent === undefined)
  if (!rootFlatNode) {
    throw new Error("[zag-js/tree] No root node found in flattened data")
  }

  // Create node map for quick lookup
  const nodeMap = new Map<number, FlatTreeNode<T>>()
  nodes.forEach((node) => {
    nodeMap.set(node._index, node)
  })

  // Build the tree recursively
  const buildNode = (idx: number): T => {
    const flatNode = nodeMap.get(idx)
    if (!flatNode) {
      return {} as T
    }

    const {_children, _index, _parent, ...cleanNode} = flatNode

    // Recursively build children
    const children: T[] = []
    _children?.forEach((childIndex) => {
      children.push(buildNode(childIndex))
    })

    return {
      ...cleanNode,
      ...(children.length > 0 && {children}),
    } as T
  }

  // Use the actual root node from flattened data
  const rootNode = buildNode(rootFlatNode._index)

  return new TreeCollection({...options, rootNode})
}

/**
 * Converts an array of file paths into a tree structure.
 * @param paths - Array of file path strings
 */
export function filePathToTree(
  paths: string[],
): TreeCollection<FilePathTreeNode> {
  const rootNode: FilePathTreeNode = {
    children: [],
    text: "",
    value: "ROOT",
  }

  paths.forEach((path) => {
    const parts = path.split("/")
    let currentNode = rootNode

    parts.forEach((part, index) => {
      let childNode = currentNode.children?.find(
        (child: any) => child.text === part,
      )

      if (!childNode) {
        childNode = {
          text: part,
          value: parts.slice(0, index + 1).join("/"),
        }
        currentNode.children ||= []
        currentNode.children.push(childNode)
      }

      currentNode = childNode
    })
  })

  return new TreeCollection({rootNode})
}

function getNodeProp<T extends TreeNode>(
  node: T,
  propOrGetter: string | number | symbol | ((node: T) => any),
): any {
  if (typeof node !== "object" || !node) {
    return node
  }
  if (typeof propOrGetter === "function") {
    return propOrGetter(node)
  }
  return (node as any)[propOrGetter]
}

const fallbackAccessors: TreeCollectionAccessors<TreeNode> = {
  nodeChildren: "nodes",
  nodeChildrenCount(node) {
    if (isObject(node) && hasProp(node, "childrenCount")) {
      return node.childrenCount
    }
  },
  nodeDisabled(node) {
    if (isObject(node) && hasProp(node, "disabled")) {
      return !!node.disabled
    }
    return false
  },
  nodeText(node) {
    if (typeof node === "string") {
      return node
    }
    if (isObject(node) && hasProp(node, "text")) {
      return node.text
    }
    return getNodeProp<TreeNode>(node, fallbackAccessors.nodeValue)
  },
  nodeValue(node: any) {
    if (typeof node === "string") {
      return node
    }
    if (isObject(node)) {
      if (hasProp(node, "value")) {
        return node.value
      } else if (hasProp(node, "id")) {
        return (node as any).id
      }
    }
    return ""
  },
}
