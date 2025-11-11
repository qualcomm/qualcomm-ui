// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreDialog,
  type CoreDialogCloseTriggerProps,
} from "@qualcomm-ui/react-core/dialog"

export interface DialogCloseTriggerProps extends CoreDialogCloseTriggerProps {}

/**
 * A button that closes the dialog.  Doesn't render anything by itself. Uses a
 * render prop to spread its props onto the child element.
 *
 * @example
 * ```tsx
 * <Dialog.CloseTrigger>
 *   <button>Close Dialog</button>
 * </Dialog.CloseTrigger>
 * ```
 */
export function DialogCloseTrigger(
  props: DialogCloseTriggerProps,
): ReactElement {
  return <CoreDialog.CloseTrigger {...props} />
}
