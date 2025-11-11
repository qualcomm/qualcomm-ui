// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {renderProp, type RenderProp} from "@qualcomm-ui/react-core/system"
import {useTreeContext} from "@qualcomm-ui/react-core/tree"

import {TreeBranch} from "./tree-branch"
import {TreeBranchContent} from "./tree-branch-content"
import {
  TreeBranchIndentGuide,
  type TreeBranchIndentGuideProps,
} from "./tree-branch-indent-guide"
import {
  TreeNodeProvider,
  type TreeNodeProviderProps,
} from "./tree-node-provider"

export interface TreeNodesProps<T>
  extends Omit<TreeNodeProviderProps<T>, "children"> {
  /**
   * Props passed to the branch indent guide component. Only applicable when {@link
   * showIndentGuide} is true.
   *
   * @inheritDoc
   */
  indentGuideProps?: TreeBranchIndentGuideProps

  /**
   * {@link https://react-next.qui.qualcomm.com/render-props#render-prop Render Prop}
   * for the tree's branch items. Use this prop to supply the content of the branch
   * item like the text, indicator, or icon.
   *
   * @inheritDoc
   */
  renderBranch: RenderProp<TreeNodesProps<T>>

  /**
   * {@link https://react-next.qui.qualcomm.com/render-props#render-prop Render Prop}
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
                renderLeaf={props.renderLeaf}
                showIndentGuide={showIndentGuide}
              />
            ))}
          </TreeBranchContent>
        </TreeBranch>
      ) : (
        renderProp(renderLeaf, props)
      )}
    </TreeNodeProvider>
  )
}
