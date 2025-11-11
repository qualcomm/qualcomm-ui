// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {Collapsible} from "@qualcomm-ui/react/collapsible"
import type {ElementRenderProp} from "@qualcomm-ui/react-core/system"
import {useTreeBranch} from "@qualcomm-ui/react-core/tree"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsTreeContext} from "./qds-tree-context"

export interface TreeBranchProps extends ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * Groups the branch node and its content element. Renders a `<div>` element by
 * default.
 */
export function TreeBranch(props: TreeBranchProps): ReactElement {
  const qdsContext = useQdsTreeContext()
  const treeBranchProps = useTreeBranch()
  const mergedProps = mergeProps(
    qdsContext.getBranchBindings(),
    treeBranchProps,
    props,
  )

  return <Collapsible.Root {...mergedProps} />
}
