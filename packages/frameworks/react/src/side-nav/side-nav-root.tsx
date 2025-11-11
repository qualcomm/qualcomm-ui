// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import type {QdsSideNavRootProps} from "@qualcomm-ui/qds-core/side-nav"
import {
  CoreSideNav,
  type CoreSideNavRootProps,
} from "@qualcomm-ui/react-core/side-nav"
import type {TreeNode} from "@qualcomm-ui/utils/collection"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {qdsSideNavApi} from "./qds-side-nav-context"

export interface SideNavRootProps<T = TreeNode>
  extends CoreSideNavRootProps<T>,
    QdsSideNavRootProps {}

export function SideNavRoot<T = TreeNode>({
  surface,
  ...props
}: SideNavRootProps<T>): ReactElement {
  const mergedProps = mergeProps(
    qdsSideNavApi.getRootBindings({surface}),
    props,
  )

  return <CoreSideNav.Root {...mergedProps} />
}
