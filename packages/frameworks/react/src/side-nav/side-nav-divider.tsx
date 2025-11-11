// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {Divider, type DividerProps} from "@qualcomm-ui/react/divider"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {qdsSideNavApi} from "./qds-side-nav-context"

export interface SideNavDividerProps
  extends Omit<DividerProps, "orientation" | "variant"> {}

export function SideNavDivider(props: SideNavDividerProps): ReactElement {
  const mergedProps = mergeProps(qdsSideNavApi.getDividerBindings(), props)

  return <Divider {...mergedProps} />
}
