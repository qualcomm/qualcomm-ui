// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {Tree} from "@qualcomm-ui/react/tree"
import type {LucideIconOrNode} from "@qualcomm-ui/react-core/lucide"
import {useTreeContext} from "@qualcomm-ui/react-core/tree"
import {
  getAccessibleDescription,
  getPreviewOptions,
  type JsonNode,
  type JsonNodeHastElement,
  jsonNodeToElement,
  keyPathToKey,
} from "@qualcomm-ui/utils/json-tree"

import {useJsonViewerOptions} from "./json-viewer-context"
import {JsonViewerKeyNode} from "./json-viewer-key-node"
import {JsonViewerValueNode} from "./json-viewer-value-node"

export interface JsonViewerNodeBaseProps {
  /**
   * Icon used for the branch expand/collapse trigger.
   */
  arrow?: LucideIconOrNode

  /**
   * Whether to render vertical indent guide lines for nested levels.
   */
  indentGuide?: boolean

  /**
   * Custom render function for value nodes.
   *
   * @inheritDoc
   */
  renderValue?: (node: JsonNodeHastElement) => ReactNode
}

export interface JsonViewerNodeProps extends JsonViewerNodeBaseProps {
  indexPath: number[]
  node: JsonNode
}

export function JsonViewerNode({
  arrow,
  indentGuide,
  indexPath,
  node,
  renderValue,
}: JsonViewerNodeProps): ReactElement {
  const treeContext = useTreeContext()
  const jsonOptions = useJsonViewerOptions() ?? {}
  const previewOptions = getPreviewOptions(jsonOptions)
  const nodeState = treeContext.getNodeState({indexPath, node})

  const key = keyPathToKey(node.keyPath, {excludeRoot: true})
  const hastElement = jsonNodeToElement(node, previewOptions)
  const description = getAccessibleDescription(node, previewOptions)

  if (nodeState.isBranch) {
    return (
      <Tree.NodeProvider indexPath={indexPath} node={node}>
        <Tree.Branch>
          <Tree.BranchNode aria-label={description}>
            {arrow != null && <Tree.BranchTrigger icon={arrow} />}
            <Tree.NodeText>
              {key && (
                <JsonViewerKeyNode
                  node={node}
                  showQuotes={jsonOptions.quotesOnKeys}
                />
              )}
              <JsonViewerValueNode
                node={hastElement}
                renderValue={renderValue}
              />
            </Tree.NodeText>
          </Tree.BranchNode>
          <Tree.BranchContent>
            {indentGuide && <Tree.BranchIndentGuide />}
            {node.children?.map((child, i) => (
              <JsonViewerNode
                key={treeContext.collection.getNodeValue(child)}
                arrow={arrow}
                indentGuide={indentGuide}
                indexPath={[...indexPath, i]}
                node={child}
                renderValue={renderValue}
              />
            ))}
          </Tree.BranchContent>
        </Tree.Branch>
      </Tree.NodeProvider>
    )
  }

  return (
    <Tree.NodeProvider indexPath={indexPath} node={node}>
      <Tree.LeafNode aria-label={description}>
        <Tree.NodeText>
          {key && (
            <JsonViewerKeyNode
              node={node}
              showQuotes={jsonOptions.quotesOnKeys}
            />
          )}
          <JsonViewerValueNode node={hastElement} renderValue={renderValue} />
        </Tree.NodeText>
      </Tree.LeafNode>
    </Tree.NodeProvider>
  )
}
