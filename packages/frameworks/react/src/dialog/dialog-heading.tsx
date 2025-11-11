// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreDialog,
  type CoreDialogHeadingProps,
} from "@qualcomm-ui/react-core/dialog"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsDialogContext} from "./qds-dialog-context"

export interface DialogHeadingProps extends CoreDialogHeadingProps {}

/**
 * A heading that labels the dialog. Renders an `<h2>` element by default.
 *
 * @example
 * ```tsx
 * <Dialog.Content>
 *   <Dialog.Body>
 *     <Dialog.Heading>Title...</Dialog.Heading>
 *     // ... other
 *   </Dialog.Body>
 * </Dialog.Content>
 * ```
 */
export function DialogHeading(props: DialogHeadingProps): ReactElement {
  const qdsContext = useQdsDialogContext()
  const mergedProps = mergeProps(qdsContext.getHeadingBindings(), props)

  return <CoreDialog.Heading {...mergedProps} />
}
