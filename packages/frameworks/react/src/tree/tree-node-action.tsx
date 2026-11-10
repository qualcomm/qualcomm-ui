// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreTree,
  type CoreTreeNodeActionProps,
} from "@qualcomm-ui/react-core/tree"
import {IconButton, type IconButtonProps} from "@qualcomm-ui/react/button"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsTreeContext} from "./qds-tree-context.js"

export interface TreeNodeActionProps
  extends CoreTreeNodeActionProps, Pick<IconButtonProps, "icon" | "size"> {}

/**
 * An action button within a tree item's interactive area. Renders a `<button>`
 * element by default.
 */
export function TreeNodeAction(props: TreeNodeActionProps): ReactElement {
  const qdsContext = useQdsTreeContext()
  const mergedProps = mergeProps(qdsContext.getNodeActionBindings(), props)

  return (
    <CoreTree.NodeAction
      render={
        <IconButton density="compact" icon={props.icon} variant="ghost" />
      }
      {...mergedProps}
    />
  )
}
