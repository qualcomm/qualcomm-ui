// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreSideNav,
  type CoreSideNavHeaderLogoProps,
} from "@qualcomm-ui/react-core/side-nav"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {qdsSideNavApi} from "./qds-side-nav-context"

export interface SideNavHeaderLogoProps extends CoreSideNavHeaderLogoProps {}

export function SideNavHeaderLogo({
  ...props
}: SideNavHeaderLogoProps): ReactElement {
  const mergedProps = mergeProps(qdsSideNavApi.getHeaderLogoBindings(), props)

  return <CoreSideNav.HeaderLogo {...mergedProps} />
}
