// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreTree,
  type CoreTreeBranchIndentGuideProps,
} from "@qualcomm-ui/react-core/tree"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsTreeContext} from "./qds-tree-context"

export interface TreeBranchIndentGuideProps
  extends CoreTreeBranchIndentGuideProps {}

/**
 * Provides a visual guide to the indentation level of the branch's children.
 * Renders a `<div>` element by default.
 */
export function TreeBranchIndentGuide(
  props: TreeBranchIndentGuideProps,
): ReactElement {
  const qdsContext = useQdsTreeContext()
  const mergedProps = mergeProps(
    qdsContext.getBranchIndentGuideBindings(),
    props,
  )

  return <CoreTree.BranchIndentGuide {...mergedProps} />
}
