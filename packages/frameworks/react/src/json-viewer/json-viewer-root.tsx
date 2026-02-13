// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, useMemo} from "react"

import {createTreeCollection} from "@qualcomm-ui/core/tree"
import {jsonViewerClasses} from "@qualcomm-ui/qds-core/json-viewer"
import {Tree, type TreeRootProps} from "@qualcomm-ui/react/tree"
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
  JsonViewerOptionsProvider,
} from "./json-viewer-context"

export interface JsonViewerRootProps
  extends Omit<TreeRootProps<JsonNode>, "collection">,
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

export function JsonViewerRoot({
  data,
  defaultExpandedDepth = 0,
  ...props
}: JsonViewerRootProps): ReactElement {
  const [jsonOptions, treeProps] = splitProps(props, [
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

  return (
    <JsonViewerOptionsProvider value={jsonOptions}>
      <Tree.Root<JsonNode>
        className={jsonViewerClasses.root}
        collection={collection}
        defaultExpandedValue={defaultExpandedValue}
        typeahead={false}
        {...treeProps}
      />
    </JsonViewerOptionsProvider>
  )
}
