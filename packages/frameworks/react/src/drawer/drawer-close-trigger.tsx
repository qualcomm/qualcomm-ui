// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreDialog,
  type CoreDialogCloseTriggerProps,
} from "@qualcomm-ui/react-core/dialog"

export interface DrawerCloseTriggerProps extends CoreDialogCloseTriggerProps {}

/**
 * A button that closes the drawer.  Doesn't render anything by itself. Uses a
 * render prop to spread its props onto the child element, which triggers the close
 * action on activation.
 *
 * @example
 * ```tsx
 * <Dialog.CloseTrigger>
 *   <button>Close Dialog</button>
 * </Dialog.CloseTrigger>
 * ```
 */
export function DrawerCloseTrigger(
  props: DrawerCloseTriggerProps,
): ReactElement {
  return <CoreDialog.CloseTrigger {...props} />
}
