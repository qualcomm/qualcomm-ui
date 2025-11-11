// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {Collapsible} from "@qualcomm-ui/react/collapsible"
import type {ElementRenderProp} from "@qualcomm-ui/react-core/system"
import {useTreeBranchContent} from "@qualcomm-ui/react-core/tree"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsTreeContext} from "./qds-tree-context"

export interface TreeBranchContentProps extends ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * Container element for the branch node's children. Renders a `<div>` element by
 * default.
 */
export function TreeBranchContent(props: TreeBranchContentProps): ReactElement {
  const qdsContext = useQdsTreeContext()
  const treeBranchContentProps = useTreeBranchContent()
  const mergedProps = mergeProps(
    qdsContext.getBranchContentBindings(),
    treeBranchContentProps,
    props,
  )

  return <Collapsible.Content {...mergedProps} />
}
