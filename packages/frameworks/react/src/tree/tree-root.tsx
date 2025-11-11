// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, useMemo} from "react"

import {createQdsTreeApi, type QdsTreeApiProps} from "@qualcomm-ui/qds-core/tree"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {CoreTree, type CoreTreeRootProps} from "@qualcomm-ui/react-core/tree"
import type {TreeNode} from "@qualcomm-ui/utils/collection"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {QdsTreeContextProvider} from "./qds-tree-context"

export interface TreeRootProps<T extends TreeNode = TreeNode>
  extends CoreTreeRootProps<T>,
    QdsTreeApiProps {}

/**
 * Groups all parts of the tree. Renders a `<div>` element by default.
 */
export function TreeRoot<T extends TreeNode = TreeNode>({
  size,
  ...props
}: TreeRootProps<T>): ReactElement {
  const qdsContext = useMemo(
    () =>
      createQdsTreeApi(
        {
          size,
        },
        normalizeProps,
      ),
    [size],
  )

  const mergedProps = mergeProps(qdsContext.getRootBindings(), props)

  return (
    <QdsTreeContextProvider value={qdsContext}>
      <CoreTree.Root {...mergedProps} />
    </QdsTreeContextProvider>
  )
}
