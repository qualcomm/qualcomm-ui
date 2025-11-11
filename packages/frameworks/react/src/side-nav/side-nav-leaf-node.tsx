// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {CoreTree, type CoreTreeLeafNodeProps} from "@qualcomm-ui/react-core/tree"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {qdsSideNavApi} from "./qds-side-nav-context"

export interface SideNavLeafNodeProps extends CoreTreeLeafNodeProps {}

/**
 * A childless tree node. Renders a `<div>` element by default.
 */
export function SideNavLeafNode(props: SideNavLeafNodeProps): ReactElement {
  const mergedProps = mergeProps(qdsSideNavApi.getLeafNodeBindings(), props)

  return <CoreTree.LeafNode {...mergedProps} />
}
