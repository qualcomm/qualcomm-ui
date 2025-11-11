// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreDialog,
  type CoreDialogTriggerProps,
} from "@qualcomm-ui/react-core/dialog"

export interface DrawerTriggerProps extends CoreDialogTriggerProps {}

/**
 * A button that opens the drawer.  Doesn't render anything by itself. Uses a render
 * prop to spread its props onto the child element.
 *
 * @example
 * ```tsx
 * <Dialog.Trigger>
 *   <button>Open Dialog</button>
 * </Dialog.Trigger>
 * ```
 */
export function DrawerTrigger(props: DrawerTriggerProps): ReactElement {
  return <CoreDialog.Trigger {...props} />
}
