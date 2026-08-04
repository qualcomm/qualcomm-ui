// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import {CoreDialog} from "@qualcomm-ui/react-core/dialog"
import type {DialogPositionerProps} from "@qualcomm-ui/react/dialog"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsDrawerContext} from "./qds-drawer-context.js"

export interface DrawerPositionerProps extends DialogPositionerProps {}

/**
 * A container that positions the drawer on the screen. Renders a `<div>` element by
 * default.
 */
export function DrawerPositioner(props: DrawerPositionerProps): ReactNode {
  const qdsContext = useQdsDrawerContext()
  const mergedProps = mergeProps(qdsContext.getPositionerBindings(), props)

  return <CoreDialog.Positioner {...mergedProps} />
}
