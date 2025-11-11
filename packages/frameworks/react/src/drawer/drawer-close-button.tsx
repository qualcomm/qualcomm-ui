// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {Dialog, type DialogCloseButtonProps} from "@qualcomm-ui/react/dialog"

export interface DrawerCloseButtonProps extends DialogCloseButtonProps {}

/**
 * A button that closes the drawer. Renders a `<button>` element by default.
 */
export function DrawerCloseButton(props: DrawerCloseButtonProps): ReactElement {
  return <Dialog.CloseButton {...props} />
}
