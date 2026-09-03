// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {jsonViewerClasses} from "@qualcomm-ui/qds-core/json-viewer"
import {Tree, type TreeRootProps} from "@qualcomm-ui/react/tree"
import type {JsonNode} from "@qualcomm-ui/utils/json-tree"

import {
  type JsonViewerOptions,
  JsonViewerOptionsProvider,
} from "./json-viewer-context"
import {useJsonViewer} from "./use-json-viewer"

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

export function JsonViewerRoot(props: JsonViewerRootProps): ReactElement {
  const {collection, defaultExpandedValue, options, treeProps} =
    useJsonViewer(props)

  return (
    <JsonViewerOptionsProvider value={options}>
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
