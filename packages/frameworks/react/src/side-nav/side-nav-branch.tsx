// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {CoreCollapsible} from "@qualcomm-ui/react-core/collapsible"
import type {ElementRenderProp} from "@qualcomm-ui/react-core/system"
import {useTreeBranch} from "@qualcomm-ui/react-core/tree"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {qdsSideNavApi} from "./qds-side-nav-context"

export interface SideNavBranchProps extends ElementRenderProp<"div"> {}

export function SideNavBranch(props: SideNavBranchProps): ReactElement {
  const treeBranchProps = useTreeBranch()
  const mergedProps = mergeProps(
    qdsSideNavApi.getBranchBindings(),
    treeBranchProps,
    props,
  )

  return <CoreCollapsible.Root {...mergedProps} />
}
