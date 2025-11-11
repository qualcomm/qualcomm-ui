// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreDialog,
  type CoreDialogFooterProps,
} from "@qualcomm-ui/react-core/dialog"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsDialogContext} from "./qds-dialog-context"

export interface DialogFooterProps extends CoreDialogFooterProps {}

/**
 * Content that appears at the bottom of the dialog, typically reserved for actions.
 * Renders a `<div>` element by default.
 */
export function DialogFooter(props: DialogFooterProps): ReactElement {
  const qdsContext = useQdsDialogContext()
  const mergedProps = mergeProps(qdsContext.getFooterBindings(), props)

  return <CoreDialog.Footer {...mergedProps} />
}
