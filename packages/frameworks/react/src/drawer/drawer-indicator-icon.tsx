// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {Dialog, type DialogIndicatorIconProps} from "@qualcomm-ui/react/dialog"

export interface DrawerIndicatorIconProps extends DialogIndicatorIconProps {}

/**
 * Renders an icon that indicates the drawer's status. Renders a `<span>` element by
 * default.
 */
export function DrawerIndicatorIcon(
  props: DrawerIndicatorIconProps,
): ReactElement {
  return <Dialog.IndicatorIcon {...props} />
}
