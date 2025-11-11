// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreTree,
  type CoreTreeNodeIndicatorProps,
} from "@qualcomm-ui/react-core/tree"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsTreeContext} from "./qds-tree-context"

export interface TreeNodeIndicatorProps extends CoreTreeNodeIndicatorProps {}

/**
 * Indicates whether the tree item is selected. Renders a `<div>` element by default.
 */
export function TreeNodeIndicator(props: TreeNodeIndicatorProps): ReactElement {
  const qdsContext = useQdsTreeContext()
  const mergedProps = mergeProps(qdsContext.getNodeIndicatorBindings(), props)

  return <CoreTree.NodeIndicator {...mergedProps} />
}
