// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreDialog,
  type CoreDialogDescriptionProps,
} from "@qualcomm-ui/react-core/dialog"

export interface DialogDescriptionProps extends CoreDialogDescriptionProps {}

/**
 * A description with additional information about the dialog. Renders a `<div>`
 * element by default.
 */
export function DialogDescription(props: DialogDescriptionProps): ReactElement {
  return <CoreDialog.Description {...props} />
}
