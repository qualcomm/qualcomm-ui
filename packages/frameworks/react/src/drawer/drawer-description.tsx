// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {Dialog, type DialogDescriptionProps} from "@qualcomm-ui/react/dialog"

export interface DrawerDescriptionProps extends DialogDescriptionProps {}

/**
 * A description with additional information about the drawer. Renders a `<div>`
 * element by default.
 */
export function DrawerDescription(props: DrawerDescriptionProps): ReactElement {
  return <Dialog.Description {...props} />
}
