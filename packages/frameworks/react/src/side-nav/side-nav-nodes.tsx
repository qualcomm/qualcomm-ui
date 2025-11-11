// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {renderProp, type RenderProp} from "@qualcomm-ui/react-core/system"
import {useTreeContext} from "@qualcomm-ui/react-core/tree"

import {SideNavBranch} from "./side-nav-branch"
import {SideNavBranchContent} from "./side-nav-branch-content"
import {
  SideNavBranchIndentGuide,
  type SideNavBranchIndentGuideProps,
} from "./side-nav-branch-indent-guide"
import {
  SideNavNodeProvider,
  type SideNavNodeProviderProps,
} from "./side-nav-node-provider"

export interface SideNavNodesProps<T>
  extends Omit<SideNavNodeProviderProps<T>, "children"> {
  groupBy?: (node: T, index: number) => PropertyKey | undefined

  /**
   * Props passed to the branch indent guide component. Only applicable when {@link
   * showIndentGuide} is true.
   *
   * @inheritDoc
   */
  indentGuideProps?: SideNavBranchIndentGuideProps

  /**
   * {@link https://react-next.qui.qualcomm.com/render-props#render-prop Render Prop}
   * for the tree's branch nodes. Use this prop to supply the content of the branch
   * node like the text, indicator, or icon.
   *
   * @inheritDoc
   */
  renderBranch: RenderProp<SideNavNodesProps<T>>

  /**
   * {@link https://react-next.qui.qualcomm.com/render-props#render-prop Render Prop}
   * for the tree's leaf nodes. Use this prop to supply the content of the leaf node
   * like the text, indicator, or icon.
   *
   * @inheritDoc
   */
  renderLeaf: RenderProp<SideNavNodesProps<T>>

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
export function SideNavNodes<
  T extends NonNullable<unknown> = NonNullable<unknown>,
>(props: SideNavNodesProps<T>): ReactElement {
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
    <SideNavNodeProvider {...props}>
      {childNodes.length ? (
        <SideNavBranch>
          {renderProp(renderBranch, props)}

          <SideNavBranchContent>
            {showIndentGuide ? (
              <SideNavBranchIndentGuide {...indentGuideProps} />
            ) : null}
            {collection.getNodeChildren(node).map((childNode, index) => (
              <SideNavNodes
                key={collection.getNodeValue(childNode)}
                indexPath={[...indexPath, index]}
                node={childNode}
                renderBranch={props.renderBranch}
                renderLeaf={props.renderLeaf}
                showIndentGuide={showIndentGuide}
              />
            ))}
          </SideNavBranchContent>
        </SideNavBranch>
      ) : (
        renderProp(renderLeaf, props)
      )}
    </SideNavNodeProvider>
  )
}
