// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import {createQdsJsonViewerApi} from "@qualcomm-ui/qds-core/json-viewer"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import type {JsonNodeHastElement} from "@qualcomm-ui/utils/json-tree"

const qdsApi = createQdsJsonViewerApi(normalizeProps)

export interface JsonViewerValueNodeProps {
  node: JsonNodeHastElement
  renderValue?: (node: JsonNodeHastElement) => ReactNode
}

export function JsonViewerValueNode({
  node,
  renderValue,
}: JsonViewerValueNodeProps): ReactNode {
  if (node.type === "text") {
    return <>{renderValue?.(node) ?? node.value}</>
  }

  const Element = node.tagName
  const isRoot = node.properties.root || node.properties.nodeType != null
  const bindings = qdsApi.getValueBindings({
    kind: node.properties.kind,
    nodeType: node.properties.nodeType,
    root: isRoot,
  })

  return (
    <Element {...bindings}>
      {node.children.map((child, index) => (
        <JsonViewerValueNode
          key={index}
          node={child}
          renderValue={renderValue}
        />
      ))}
    </Element>
  )
}
