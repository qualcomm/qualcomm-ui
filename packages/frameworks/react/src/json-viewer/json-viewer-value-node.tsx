// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import {jsonViewerClasses} from "@qualcomm-ui/qds-core/json-viewer"
import type {JsonNodeHastElement} from "@qualcomm-ui/utils/json-tree"

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

  return (
    <Element
      className={isRoot ? jsonViewerClasses.value : undefined}
      data-kind={node.properties.kind}
      data-root={node.properties.root ? "" : undefined}
      data-type={node.properties.nodeType}
    >
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
