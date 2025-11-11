// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import {CoreDialog, type CoreDialogContentProps} from "@qualcomm-ui/react-core/dialog"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsDialogContext} from "./qds-dialog-context"

export interface DialogContentProps extends CoreDialogContentProps {}

/**
 * A container for the dialog contents. Renders a `<section>` element by default.
 *
 * @example
 * ```tsx
 * <Dialog.Root>
 *   <Dialog.Positioner>
 *     <Dialog.Content></Dialog.Content>
 *   </Dialog.Positioner>
 * </Dialog.Root>
 * ```
 */
export function DialogContent(props: DialogContentProps): ReactNode {
  const qdsContext = useQdsDialogContext()
  const mergedProps = mergeProps(qdsContext.getContentBindings(), props)

  return <CoreDialog.Content {...mergedProps} />
}
