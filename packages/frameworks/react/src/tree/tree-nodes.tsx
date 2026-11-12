// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {renderProp, type RenderProp} from "@qualcomm-ui/react-core/system"
import {useTreeContext} from "@qualcomm-ui/react-core/tree"

import {TreeBranchContent} from "./tree-branch-content.js"
import {
  TreeBranchIndentGuide,
  type TreeBranchIndentGuideProps,
} from "./tree-branch-indent-guide.js"
import {TreeBranch} from "./tree-branch.js"
import {
  TreeNodeProvider,
  type TreeNodeProviderProps,
} from "./tree-node-provider.js"

export interface TreeNodesProps<T> extends Omit<
  TreeNodeProviderProps<T>,
  "children"
> {
  /**
   * Props passed to the branch indent guide component. Only applicable when {@link
   * showIndentGuide} is true.
   *
   * @inheritDoc
   */
  indentGuideProps?: TreeBranchIndentGuideProps

  /**
   * {@link https://react.qui.qualcomm.com/render-props#render-prop Render Prop}
   * for the tree's branch items. Use this prop to supply the content of the branch
   * item like the text, indicator, or icon.
   *
   * @inheritDoc
   */
  renderBranch: RenderProp<TreeNodesProps<T>>

  /**
   * Content rendered after a branch's children, inside its collapsible content.
   */
  renderBranchEnd?: RenderProp<TreeNodesProps<T>>

  /**
   * {@link https://react.qui.qualcomm.com/render-props#render-prop Render Prop}
   * for the tree's leaf items. Use this prop to supply the content of the leaf item
   * like the text, indicator, or icon.
   *
   * @inheritDoc
   */
  renderLeaf: RenderProp<TreeNodesProps<T>>

  /**
   * Whether to render the indent guide for branch child nodes.
   *
   * @default false
   */
  showIndentGuide?: boolean
}

/**
 * A helper component that renders recursive tree nodes. Doesn't render its own HTML
 * element.
 */
export function TreeNodes<
  T extends NonNullable<unknown> = NonNullable<unknown>,
>(props: TreeNodesProps<T>): ReactElement {
  const context = useTreeContext()
  const {
    indentGuideProps,
    indexPath,
    node,
    renderBranch,
    renderBranchEnd,
    renderLeaf,
    showIndentGuide,
  } = props
  const {collection} = context
  const childNodes = collection.getNodeChildren(node)

  return (
    <TreeNodeProvider {...props}>
      {childNodes.length ? (
        <TreeBranch>
          {renderProp(renderBranch, props)}

          <TreeBranchContent>
            {showIndentGuide ? (
              <TreeBranchIndentGuide {...indentGuideProps} />
            ) : null}
            {collection.getNodeChildren(node).map((childNode, index) => (
              <TreeNodes
                key={collection.getNodeValue(childNode)}
                indexPath={[...indexPath, index]}
                node={childNode}
                renderBranch={props.renderBranch}
                renderBranchEnd={renderBranchEnd}
                renderLeaf={props.renderLeaf}
                showIndentGuide={showIndentGuide}
              />
            ))}
            {renderBranchEnd ? renderProp(renderBranchEnd, props) : null}
          </TreeBranchContent>
        </TreeBranch>
      ) : (
        renderProp(renderLeaf, props)
      )}
    </TreeNodeProvider>
  )
}
