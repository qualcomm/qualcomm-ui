// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {useMemo} from "react"

import {createTreeCollection, type TreeApiProps} from "@qualcomm-ui/core/tree"
import type {TreeCollection} from "@qualcomm-ui/utils/collection"
import {
  getPreviewOptions,
  getRootNode,
  type JsonNode,
  nodeToString,
  nodeToValue,
} from "@qualcomm-ui/utils/json-tree"
import {splitProps} from "@qualcomm-ui/utils/object"

import {
  JSON_VIEWER_OPTION_KEYS,
  type JsonViewerOptions,
} from "./json-viewer-context"

export interface UseJsonViewerProps
  extends Omit<TreeApiProps<JsonNode>, "collection">,
    JsonViewerOptions {
  /**
   * The data to display in the JSON viewer. Accepts any JavaScript value.
   */
  data: unknown

  /**
   * The default depth to expand the tree to.
   *
   * @default 0
   */
  defaultExpandedDepth?: number
}

export interface UseJsonViewerReturn {
  /**
   * The tree data structure built from `data`. Use for programmatic tree
   * operations like querying branch values for expand/collapse control.
   *
   * @inheritDoc
   */
  collection: TreeCollection<JsonNode>

  /**
   * Array of node values to expand by default, derived from `defaultExpandedDepth`.
   * Pass to `[expandedValue]` as the initial controlled value.
   */
  defaultExpandedValue: string[] | undefined

  /**
   * Consumed by `JsonViewer.RootProvider` to configure display formatting.
   *
   * @inheritDoc
   */
  options: JsonViewerOptions

  /**
   * Consumed by `JsonViewer.RootProvider` and forwarded to the underlying tree root.
   *
   * @inheritDoc
   */
  treeProps: Omit<TreeApiProps<JsonNode>, "collection">
}

export function useJsonViewer(props: UseJsonViewerProps): UseJsonViewerReturn {
  const {data, defaultExpandedDepth = 0, ...rest} = props
  const [jsonOptions, treeProps] = splitProps(rest, [
    ...JSON_VIEWER_OPTION_KEYS,
  ])

  const previewOptions = useMemo(
    () => getPreviewOptions(jsonOptions),
    [jsonOptions],
  )

  const collection = useMemo(
    () =>
      createTreeCollection<JsonNode>({
        nodeChildren: "children",
        nodeText: nodeToString,
        nodeValue: nodeToValue,
        rootNode: getRootNode(data, previewOptions),
      }),
    [data, previewOptions],
  )

  const defaultExpandedValue = useMemo(
    () =>
      defaultExpandedDepth != null
        ? collection.getBranchValues(undefined, {
            depth: (nodeDepth) => nodeDepth <= defaultExpandedDepth,
          })
        : undefined,
    [collection, defaultExpandedDepth],
  )

  return {
    collection,
    defaultExpandedValue,
    options: jsonOptions,
    treeProps,
  }
}
