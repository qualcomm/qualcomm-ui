// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import {CoreDialog, type CoreDialogBackdropProps} from "@qualcomm-ui/react-core/dialog"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsDialogContext} from "./qds-dialog-context"

export interface DialogBackdropProps extends CoreDialogBackdropProps {}

/**
 * An overlay displayed beneath the dialog to prevent interaction with the rest of
 * the page. Renders a `<div>` element by default.
 */
export function DialogBackdrop(props: DialogBackdropProps): ReactNode {
  const qdsContext = useQdsDialogContext()
  const mergedProps = mergeProps(qdsContext.getBackdropBindings(), props)

  return <CoreDialog.Backdrop {...mergedProps} />
}
