// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreTree,
  type CoreTreeNodeActionProps,
} from "@qualcomm-ui/react-core/tree"
import {IconButton, type IconButtonProps} from "@qualcomm-ui/react/button"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {qdsSideNavApi} from "./qds-side-nav-context.js"

export interface SideNavNodeActionProps
  extends CoreTreeNodeActionProps, Omit<IconButtonProps, "variant"> {}

/**
 * An action button within a tree node's interactive area. Renders a `<button>`
 * element by default.
 */
export function SideNavNodeAction(props: SideNavNodeActionProps): ReactElement {
  const mergedProps = mergeProps(qdsSideNavApi.getNodeActionBindings(), props)

  return (
    <CoreTree.NodeAction
      render={<IconButton density="compact" variant="ghost" icon={props.icon} />}
      {...mergedProps}
    />
  )
}
