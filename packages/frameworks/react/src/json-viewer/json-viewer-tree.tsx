// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {useTreeContext} from "@qualcomm-ui/react-core/tree"

import {JsonViewerNode, type JsonViewerNodeBaseProps} from "./json-viewer-node"

export interface JsonViewerTreeProps extends JsonViewerNodeBaseProps {}

export function JsonViewerTree(props: JsonViewerTreeProps): ReactElement {
  const treeContext = useTreeContext()
  const rootNode = treeContext.collection.rootNode
  const children = treeContext.collection.getNodeChildren(rootNode)

  return (
    <>
      {children.map((child, index) => (
        <JsonViewerNode
          key={treeContext.collection.getNodeValue(child)}
          indexPath={[index]}
          node={child}
          {...props}
        />
      ))}
    </>
  )
}
