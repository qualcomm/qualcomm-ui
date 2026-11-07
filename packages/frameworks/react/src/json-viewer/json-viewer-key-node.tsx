// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import {createQdsJsonViewerApi} from "@qualcomm-ui/qds-core/json-viewer"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {type JsonNode, keyPathToKey} from "@qualcomm-ui/utils/json-tree"

const qdsApi = createQdsJsonViewerApi(normalizeProps)

interface JsonViewerKeyNodeProps {
  node: JsonNode
  showQuotes?: boolean
}

export function JsonViewerKeyNode({
  node,
  showQuotes,
}: JsonViewerKeyNodeProps): ReactNode {
  const key = keyPathToKey(node.keyPath)
  const keyBindings = qdsApi.getKeyBindings({
    isNonEnumerable: node.isNonEnumerable,
  })
  const colonBindings = qdsApi.getColonBindings()

  return (
    <>
      <span {...keyBindings}>{showQuotes ? `"${key}"` : key}</span>
      <span {...colonBindings}>{": "}</span>
    </>
  )
}
