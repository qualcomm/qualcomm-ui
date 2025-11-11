// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {CoreTree, type CoreTreeLabelProps} from "@qualcomm-ui/react-core/tree"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsTreeContext} from "./qds-tree-context"

export interface TreeLabelProps extends CoreTreeLabelProps {}

/**
 * An optional accessible label for the tree. Renders a `<div>` element by default.
 */
export function TreeLabel(props: TreeLabelProps): ReactElement {
  const qdsContext = useQdsTreeContext()
  const mergedProps = mergeProps(qdsContext.getLabelBindings(), props)

  return <CoreTree.Label {...mergedProps} />
}
