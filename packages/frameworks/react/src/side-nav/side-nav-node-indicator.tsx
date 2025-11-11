// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {CoreTree, type CoreTreeNodeIndicatorProps} from "@qualcomm-ui/react-core/tree"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {qdsSideNavApi} from "./qds-side-nav-context"

export interface SideNavNodeIndicatorProps extends CoreTreeNodeIndicatorProps {}

/**
 * Indicates whether the tree node is selected. Renders a `<div>` element by default.
 */
export function SideNavNodeIndicator(
  props: SideNavNodeIndicatorProps,
): ReactElement {
  const mergedProps = mergeProps(
    qdsSideNavApi.getNodeIndicatorBindings(),
    props,
  )

  return <CoreTree.NodeIndicator {...mergedProps} />
}
