// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {PanelLeftClose, PanelLeftOpen} from "lucide-react"

import {IconButton} from "@qualcomm-ui/react/button"
import {
  CoreSideNav,
  type CoreSideNavTriggerProps,
  useSideNavContext,
} from "@qualcomm-ui/react-core/side-nav"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {qdsSideNavApi} from "./qds-side-nav-context"

export interface SideNavCollapseTriggerProps extends CoreSideNavTriggerProps {}

export function SideNavCollapseTrigger({
  render,
  ...props
}: SideNavCollapseTriggerProps): ReactElement {
  const {open} = useSideNavContext()
  const mergedProps = mergeProps(
    qdsSideNavApi.getCollapseTriggerBindings(),
    props,
  )

  return (
    <CoreSideNav.Trigger
      render={
        <IconButton
          icon={open ? PanelLeftClose : PanelLeftOpen}
          render={render}
          size="md"
          variant="ghost"
          {...mergedProps}
        />
      }
    />
  )
}
