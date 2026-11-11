// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {useMemo} from "react"

import type {RenderStrategyApiProps} from "@qualcomm-ui/core/presence"
import type {TreeApiProps} from "@qualcomm-ui/core/tree"
import {
  createJsonViewerCollection,
  getJsonViewerDefaultExpandedValue,
  JSON_VIEWER_OPTION_KEYS,
  type QdsJsonViewerApiProps,
  type QdsJsonViewerOptions,
} from "@qualcomm-ui/qds-core/json-viewer"
import type {TreeCollection} from "@qualcomm-ui/utils/collection"
import {getPreviewOptions, type JsonNode} from "@qualcomm-ui/utils/json-tree"
import {splitProps} from "@qualcomm-ui/utils/object"

export interface UseJsonViewerProps
  extends
    Omit<TreeApiProps<JsonNode>, "collection">,
    QdsJsonViewerApiProps,
    RenderStrategyApiProps {}

export interface UseJsonViewerReturn {
  /**
   * The tree data structure built from `data`. Use for programmatic tree
   * operations like querying branch values for expand/collapse control.
   *
   * @inheritDoc
   */
  collection: TreeCollection<JsonNode>

  /**
   * Initial expanded node values. Uses an explicit `defaultExpandedValue` when
   * provided, otherwise derives the values from `defaultExpandedDepth`.
   * Use as the initial controlled `expandedValue`.
   */
  defaultExpandedValue: string[] | undefined

  /**
   * Consumed by `JsonViewer.RootProvider` to configure display formatting.
   *
   * @inheritDoc
   */
  options: QdsJsonViewerOptions

  /**
   * Consumed by `JsonViewer.RootProvider` and forwarded to the underlying tree root.
   *
   * @inheritDoc
   */
  treeProps: Omit<TreeApiProps<JsonNode>, "collection"> & RenderStrategyApiProps
}

export function useJsonViewer(props: UseJsonViewerProps): UseJsonViewerReturn {
  const {
    data,
    defaultExpandedDepth = 0,
    defaultExpandedValue: defaultExpandedValueProp,
    ...rest
  } = props
  const [jsonOptions, treeProps] = splitProps(rest, [
    ...JSON_VIEWER_OPTION_KEYS,
  ])
  const {
    collapseStringsAfterLength,
    groupArraysAfterLength,
    maxPreviewItems,
    showNonenumerable,
  } = jsonOptions

  const previewOptions = useMemo(
    () =>
      getPreviewOptions({
        collapseStringsAfterLength,
        groupArraysAfterLength,
        maxPreviewItems,
        showNonenumerable,
      }),
    [
      collapseStringsAfterLength,
      groupArraysAfterLength,
      maxPreviewItems,
      showNonenumerable,
    ],
  )

  const collection = useMemo(
    () => createJsonViewerCollection(data, previewOptions),
    [data, previewOptions],
  )

  const defaultExpandedValue = useMemo(
    () =>
      defaultExpandedValueProp ??
      getJsonViewerDefaultExpandedValue(collection, defaultExpandedDepth),
    [collection, defaultExpandedDepth, defaultExpandedValueProp],
  )

  return {
    collection,
    defaultExpandedValue,
    options: jsonOptions,
    treeProps,
  }
}
