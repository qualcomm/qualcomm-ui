// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  jsonViewerClasses,
  type QdsJsonViewerApiProps,
} from "@qualcomm-ui/qds-core/json-viewer"
import {Tree, type TreeRootProps} from "@qualcomm-ui/react/tree"
import type {JsonNode} from "@qualcomm-ui/utils/json-tree"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {JsonViewerOptionsProvider} from "./json-viewer-context.js"
import {useJsonViewer} from "./use-json-viewer.js"

export interface JsonViewerRootProps
  extends Omit<TreeRootProps<JsonNode>, "collection">, QdsJsonViewerApiProps {}

export function JsonViewerRoot(props: JsonViewerRootProps): ReactElement {
  const {collection, defaultExpandedValue, options, treeProps} =
    useJsonViewer(props)

  const mergedProps = mergeProps(
    {
      className: jsonViewerClasses.root,
      collection,
      defaultExpandedValue,
    },
    treeProps,
  )

  return (
    <JsonViewerOptionsProvider value={options}>
      <Tree.Root<JsonNode> {...mergedProps} />
    </JsonViewerOptionsProvider>
  )
}
