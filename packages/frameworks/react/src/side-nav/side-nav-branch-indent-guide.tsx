// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreTree,
  type CoreTreeBranchIndentGuideProps,
} from "@qualcomm-ui/react-core/tree"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {qdsSideNavApi} from "./qds-side-nav-context"

export interface SideNavBranchIndentGuideProps
  extends CoreTreeBranchIndentGuideProps {}

/**
 * Provides a visual guide to the indentation level of the branch's children.
 * Renders a `<div>` element by default.
 */
export function SideNavBranchIndentGuide(
  props: SideNavBranchIndentGuideProps,
): ReactElement {
  const mergedProps = mergeProps(
    qdsSideNavApi.getBranchIndentGuideBindings(),
    props,
  )

  return <CoreTree.BranchIndentGuide {...mergedProps} />
}
