import {add, partition, remove, uniq} from "@qualcomm-ui/utils/array"
import type {TreeCollection, TreeNode, TreeSkipFn} from "@qualcomm-ui/utils/collection"
import {ensure} from "@qualcomm-ui/utils/guard"
import type {Params} from "@qualcomm-ui/utils/machine"

import type {
  CheckedState,
  CheckedValueMap,
  NodeWithError,
  TreeSchema,
} from "../tree.types"

export function skipFn(
  params: Pick<Params<TreeSchema>, "prop" | "context">,
): TreeSkipFn<any> {
  const {context, prop} = params
  return function skip({indexPath}) {
    const paths = prop("collection").getValuePath(indexPath).slice(0, -1)
    return paths.some((value) => !context.get("expandedValue").includes(value))
  }
}

export function expandBranches(
  params: Params<TreeSchema>,
  values: string[],
): void {
  const {context, prop, refs} = params

  if (!prop("loadChildren")) {
    context.set("expandedValue", (prev) => uniq(add(prev, ...values)))
    return
  }

  const loadingStatus = context.get("loadingStatus")
  const [loadedValues, loadingValues] = partition(
    values,
    (value) => loadingStatus[value] === "loaded",
  )

  if (loadedValues.length > 0) {
    context.set("expandedValue", (prev) => uniq(add(prev, ...loadedValues)))
  }

  if (loadingValues.length === 0) {
    return
  }

  const collection = prop("collection")
  const [nodeWithChildren, nodeWithoutChildren] = partition(
    loadingValues,
    (id) => {
      const node = collection.findNode(id)
      return collection.getNodeChildren(node).length > 0
    },
  )

  // Check if node already has children (skip loading)
  if (nodeWithChildren.length > 0) {
    context.set("expandedValue", (prev) => uniq(add(prev, ...nodeWithChildren)))
  }

  if (nodeWithoutChildren.length === 0) {
    return
  }

  context.set("loadingStatus", (prev) => ({
    ...prev,
    ...nodeWithoutChildren.reduce((acc, id) => ({...acc, [id]: "loading"}), {}),
  }))

  const nodesToLoad = nodeWithoutChildren.map((id) => {
    const indexPath = collection.getIndexPath(id)!
    const valuePath = collection.getValuePath(indexPath)
    const node = collection.findNode(id)!
    return {id, indexPath, node, valuePath}
  })

  const pendingAborts = refs.get("pendingAborts")

  // load children asynchronously
  const loadChildren = prop("loadChildren")
  ensure(
    loadChildren,
    () => "[@qualcomm-ui/core/tree] `loadChildren` is required for async expansion",
  )

  const proms = nodesToLoad.map(({id, indexPath, node, valuePath}) => {
    const existingAbort = pendingAborts.get(id)
    if (existingAbort) {
      existingAbort.abort()
      pendingAborts.delete(id)
    }
    const abortController = new AbortController()
    pendingAborts.set(id, abortController)
    return loadChildren({
      indexPath,
      node,
      signal: abortController.signal,
      valuePath,
    })
  })

  // prefer `Promise.allSettled` over `Promise.all` to avoid early termination
  Promise.allSettled(proms).then((results) => {
    const loadedValues: string[] = []
    const nodeWithErrors: NodeWithError[] = []

    const nextLoadingStatus = context.get("loadingStatus")

    // Read up to date collection to avoid stale data
    let collection = prop("collection")

    results.forEach((result, index) => {
      const {id, indexPath, node, valuePath} = nodesToLoad[index]
      if (result.status === "fulfilled") {
        nextLoadingStatus[id] = "loaded"
        loadedValues.push(id)
        collection = collection.replace(indexPath, {
          ...node,
          children: result.value,
        })
      } else {
        pendingAborts.delete(id)
        Reflect.deleteProperty(nextLoadingStatus, id)
        nodeWithErrors.push({error: result.reason, indexPath, node, valuePath})
      }
    })

    context.set("loadingStatus", nextLoadingStatus)

    if (loadedValues.length) {
      context.set("expandedValue", (prev) => uniq(add(prev, ...loadedValues)))
      prop("onLoadChildrenComplete")?.({collection})
    }

    if (nodeWithErrors.length) {
      prop("onLoadChildrenError")?.({nodes: nodeWithErrors})
    }
  })
}

export function getCheckedState(
  collection: TreeCollection<TreeNode>,
  node: TreeNode,
  checkedValue: string[],
): "indeterminate" | boolean {
  const value = collection.getNodeValue(node)
  if (!collection.isBranchNode(node)) {
    return checkedValue.includes(value)
  }

  const childValues = collection.getDescendantValues(value)
  const allChecked = childValues.every((v) => checkedValue.includes(v))
  const someChecked = childValues.some((v) => checkedValue.includes(v))
  return allChecked ? true : someChecked ? "indeterminate" : false
}

export function toggleBranchChecked(
  collection: TreeCollection<TreeNode>,
  value: string,
  checkedValue: string[],
): string[] {
  const childValues = collection.getDescendantValues(value)
  const allChecked = childValues.every((child) => checkedValue.includes(child))
  return uniq(
    allChecked
      ? remove(checkedValue, ...childValues)
      : add(checkedValue, ...childValues),
  )
}

export function getCheckedValueMap(
  collection: TreeCollection<TreeNode>,
  checkedValue: string[],
): Map<string, {checked: CheckedState; type: "leaf" | "branch"}> {
  const map: CheckedValueMap = new Map()

  collection.visit({
    onEnter: (node) => {
      const value = collection.getNodeValue(node)
      const isBranch = collection.isBranchNode(node)
      const checked = getCheckedState(collection, node, checkedValue)

      map.set(value, {
        checked,
        type: isBranch ? "branch" : "leaf",
      })
    },
  })

  return map
}
