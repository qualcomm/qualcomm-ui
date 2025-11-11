// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  InlineIconButton,
  type InlineIconButtonProps,
} from "@qualcomm-ui/react/inline-icon-button"
import {CoreTree, type CoreTreeNodeActionProps} from "@qualcomm-ui/react-core/tree"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {qdsSideNavApi} from "./qds-side-nav-context"

export interface SideNavNodeActionProps
  extends CoreTreeNodeActionProps,
    Omit<InlineIconButtonProps, "variant"> {}

/**
 * An action button within a tree node's interactive area. Renders a `<button>`
 * element by default.
 */
export function SideNavNodeAction(props: SideNavNodeActionProps): ReactElement {
  const mergedProps = mergeProps(qdsSideNavApi.getNodeActionBindings(), props)

  return (
    <CoreTree.NodeAction
      render={<InlineIconButton icon={props.icon} />}
      {...mergedProps}
    />
  )
}
