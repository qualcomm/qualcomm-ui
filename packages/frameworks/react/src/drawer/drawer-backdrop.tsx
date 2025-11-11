// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import {Dialog, type DialogBackdropProps} from "@qualcomm-ui/react/dialog"

export interface DrawerBackdropProps extends DialogBackdropProps {}

/**
 * An overlay displayed beneath the drawer to prevent interaction with the rest of
 * the page. Renders a `<div>` element by default.
 */
export function DrawerBackdrop(props: DrawerBackdropProps): ReactNode {
  return <Dialog.Backdrop {...props} />
}
