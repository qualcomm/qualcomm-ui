// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreDialog,
  type CoreDialogTriggerProps,
} from "@qualcomm-ui/react-core/dialog"

export interface DialogTriggerProps extends CoreDialogTriggerProps {}

/**
 * Enhances a child element to open the dialog when clicked. Requires a single child
 * element.
 *
 * @example
 * ```tsx
 * <Dialog.Trigger>
 *   <button>Open Dialog</button>
 * </Dialog.Trigger>
 * ```
 */
export function DialogTrigger(props: DialogTriggerProps): ReactElement {
  return <CoreDialog.Trigger {...props} />
}
