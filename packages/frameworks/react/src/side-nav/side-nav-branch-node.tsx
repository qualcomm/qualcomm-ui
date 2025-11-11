// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreTree,
  type CoreTreeBranchNodeProps,
} from "@qualcomm-ui/react-core/tree"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {qdsSideNavApi} from "./qds-side-nav-context"

export interface SideNavBranchNodeProps extends CoreTreeBranchNodeProps {}

/**
 * An interactive tree node with children. Renders a `<div>` element by default.
 */
export function SideNavBranchNode(props: SideNavBranchNodeProps): ReactElement {
  const mergedProps = mergeProps(qdsSideNavApi.getBranchNodeBindings(), props)

  return <CoreTree.BranchNode {...mergedProps} />
}
