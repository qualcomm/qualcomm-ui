// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreSideNav,
  type CoreSideNavHeaderActionProps,
} from "@qualcomm-ui/react-core/side-nav"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {qdsSideNavApi} from "./qds-side-nav-context"

export interface SideNavHeaderActionProps
  extends CoreSideNavHeaderActionProps {}

export function SideNavHeaderAction({
  ...props
}: SideNavHeaderActionProps): ReactElement {
  const mergedProps = mergeProps(qdsSideNavApi.getHeaderActionBindings(), props)

  return <CoreSideNav.HeaderAction {...mergedProps} />
}
