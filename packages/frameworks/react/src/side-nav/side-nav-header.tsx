// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {CoreSideNav} from "@qualcomm-ui/react-core/side-nav"
import type {ElementRenderProp} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {qdsSideNavApi} from "./qds-side-nav-context"

export interface SideNavHeaderProps extends ElementRenderProp<"div"> {}

export function SideNavHeader(props: SideNavHeaderProps): ReactElement {
  const mergedProps = mergeProps(qdsSideNavApi.getHeaderBindings(), props)
  return <CoreSideNav.Header {...mergedProps} />
}
