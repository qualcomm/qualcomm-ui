// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import {jsonViewerClasses} from "@qualcomm-ui/qds-core/json-viewer"
import {type JsonNode, keyPathToKey} from "@qualcomm-ui/utils/json-tree"

interface JsonViewerKeyNodeProps {
  node: JsonNode
  showQuotes?: boolean
}

export function JsonViewerKeyNode({
  node,
  showQuotes,
}: JsonViewerKeyNodeProps): ReactNode {
  const key = keyPathToKey(node.keyPath)

  return (
    <>
      <span
        className={jsonViewerClasses.key}
        data-non-enumerable={node.isNonEnumerable ? "" : undefined}
      >
        {showQuotes ? `"${key}"` : key}
      </span>
      <span className={jsonViewerClasses.colon}>{": "}</span>
    </>
  )
}
