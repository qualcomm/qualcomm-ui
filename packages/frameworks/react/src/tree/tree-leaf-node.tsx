// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreTree,
  type CoreTreeLeafNodeProps,
} from "@qualcomm-ui/react-core/tree"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsTreeContext} from "./qds-tree-context"

export interface TreeLeafNodeProps extends CoreTreeLeafNodeProps {}

/**
 * A childless tree item. Renders a `<div>` element by default.
 */
export function TreeLeafNode(props: TreeLeafNodeProps): ReactElement {
  const qdsContext = useQdsTreeContext()
  const mergedProps = mergeProps(qdsContext.getLeafNodeBindings(), props)

  return <CoreTree.LeafNode {...mergedProps} />
}
