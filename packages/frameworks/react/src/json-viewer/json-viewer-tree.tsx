// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import type {LucideIconOrNode} from "@qualcomm-ui/react-core/lucide"
import {useTreeContext} from "@qualcomm-ui/react-core/tree"
import {Tree} from "@qualcomm-ui/react/tree"
import {
  getAccessibleDescription,
  getPreviewOptions,
  type JsonNode,
  type JsonNodeHastElement,
  jsonNodeToElement,
  keyPathToKey,
} from "@qualcomm-ui/utils/json-tree"

import {useJsonViewerOptions} from "./json-viewer-context.js"
import {JsonViewerKeyNode} from "./json-viewer-key-node.js"
import {JsonViewerValueNode} from "./json-viewer-value-node.js"

export interface JsonViewerTreeProps {
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

export function JsonViewerTree({
  arrow,
  indentGuide,
  renderValue,
}: JsonViewerTreeProps): ReactElement {
  const treeContext = useTreeContext<JsonNode>()
  const rootNode = treeContext.collection.rootNode
  const children = treeContext.collection.getNodeChildren(rootNode)
  const jsonOptions = useJsonViewerOptions() ?? {}
  const previewOptions = getPreviewOptions(jsonOptions)

  function renderNodeText(node: JsonNode): ReactElement {
    const key = keyPathToKey(node.keyPath, {excludeRoot: true})

    return (
      <Tree.NodeText>
        {key && (
          <JsonViewerKeyNode
            node={node}
            showQuotes={jsonOptions.quotesOnKeys}
          />
        )}
        <JsonViewerValueNode
          node={jsonNodeToElement(node, previewOptions)}
          renderValue={renderValue}
        />
      </Tree.NodeText>
    )
  }

  return (
    <>
      {children.map((child, index) => (
        <Tree.Nodes
          key={treeContext.collection.getNodeValue(child)}
          indexPath={[index]}
          node={child}
          renderBranch={({node}) => (
            <Tree.BranchNode
              aria-label={getAccessibleDescription(node, previewOptions)}
            >
              {arrow != null && <Tree.BranchTrigger icon={arrow} />}
              {renderNodeText(node)}
            </Tree.BranchNode>
          )}
          renderLeaf={({node}) => (
            <Tree.LeafNode
              aria-label={getAccessibleDescription(node, previewOptions)}
            >
              {renderNodeText(node)}
            </Tree.LeafNode>
          )}
          showIndentGuide={indentGuide}
        />
      ))}
    </>
  )
}
