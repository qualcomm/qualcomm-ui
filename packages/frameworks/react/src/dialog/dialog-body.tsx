// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreDialog,
  type CoreDialogBodyProps,
} from "@qualcomm-ui/react-core/dialog"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsDialogContext} from "./qds-dialog-context"

export interface DialogBodyProps extends CoreDialogBodyProps {}

/**
 * The main content of the dialog. Container for the heading, description,
 * indicator, and primary content of the dialog. Renders a `<div>` element by
 * default.
 */
export function DialogBody(props: DialogBodyProps): ReactElement {
  const qdsContext = useQdsDialogContext()
  const mergedProps = mergeProps(qdsContext.getBodyBindings(), props)

  return <CoreDialog.Body {...mergedProps} />
}
