// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {Dialog, type DialogFooterProps} from "@qualcomm-ui/react/dialog"

export interface DrawerFooterProps extends DialogFooterProps {}

/**
 * Content that appears at the bottom of the drawer, typically reserved for actions.
 * Renders a `<div>` element by default.
 */
export function DrawerFooter(props: DialogFooterProps): ReactElement {
  return <Dialog.Footer {...props} />
}
