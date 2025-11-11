// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  InlineIconButton,
  type InlineIconButtonProps,
} from "@qualcomm-ui/react/inline-icon-button"
import {
  CoreTree,
  type CoreTreeNodeActionProps,
} from "@qualcomm-ui/react-core/tree"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsTreeContext} from "./qds-tree-context"

export interface TreeNodeActionProps
  extends CoreTreeNodeActionProps,
    Omit<InlineIconButtonProps, "variant"> {}

/**
 * An action button within a tree item's interactive area. Renders a `<button>`
 * element by default.
 */
export function TreeNodeAction(props: TreeNodeActionProps): ReactElement {
  const qdsContext = useQdsTreeContext()
  const mergedProps = mergeProps(qdsContext.getNodeActionBindings(), props)

  return (
    <CoreTree.NodeAction
      render={<InlineIconButton icon={props.icon} />}
      {...mergedProps}
    />
  )
}
