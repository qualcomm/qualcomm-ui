// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import {
  CoreDialog,
  type CoreDialogPositionerProps,
} from "@qualcomm-ui/react-core/dialog"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsDialogContext} from "./qds-dialog-context"

export interface DialogPositionerProps extends CoreDialogPositionerProps {}

/**
 * A container that positions the dialog on the screen. Renders a `<div>` element by
 * default.
 */
export function DialogPositioner(props: DialogPositionerProps): ReactNode {
  const qdsDialogContext = useQdsDialogContext()
  const mergedProps = mergeProps(
    qdsDialogContext.getPositionerBindings(),
    props,
  )

  return <CoreDialog.Positioner {...mergedProps} />
}
