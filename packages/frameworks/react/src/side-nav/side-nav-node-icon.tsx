// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {IconOrNode} from "@qualcomm-ui/react/icon"
import type {LucideIconOrNode} from "@qualcomm-ui/react-core/lucide"
import type {ElementRenderProp} from "@qualcomm-ui/react-core/system"
import {
  useTreeContext,
  useTreeNodePropsContext,
} from "@qualcomm-ui/react-core/tree"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {qdsSideNavApi} from "./qds-side-nav-context"

export interface SideNavNodeIconProps extends ElementRenderProp<"span"> {
  /**
   * lucide-react icon or JSX Element.
   */
  icon: LucideIconOrNode
}

/**
 * The icon for the tree node. Renders a `<span>` element by default.
 */
export function SideNavNodeIcon(props: SideNavNodeIconProps): ReactElement {
  const treeContext = useTreeContext()
  const nodeProps = useTreeNodePropsContext()
  const mergedProps = mergeProps(
    treeContext.getNodeIconBindings(nodeProps),
    qdsSideNavApi.getNodeIconBindings(),
    props,
  )

  return <IconOrNode {...mergedProps} />
}
