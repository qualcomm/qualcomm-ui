// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, type ReactNode, useMemo} from "react"

import {
  createQdsDialogApi,
  type QdsDialogApiProps,
} from "@qualcomm-ui/qds-core/dialog"
import {
  CoreDialog,
  type CoreDialogRootProps,
} from "@qualcomm-ui/react-core/dialog"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"

import {QdsDialogContextProvider} from "./qds-dialog-context"

export interface DialogRootProps
  extends CoreDialogRootProps,
    QdsDialogApiProps {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children: ReactNode
}

/**
 * Groups all parts of the dialog. Doesn't render its own HTML element.
 */
export function DialogRoot({
  emphasis,
  placement,
  scrollBehavior,
  size,
  ...props
}: DialogRootProps): ReactElement {
  const qdsDialogApi = useMemo(
    () =>
      createQdsDialogApi(
        {emphasis, placement, scrollBehavior, size},
        normalizeProps,
      ),
    [emphasis, placement, scrollBehavior, size],
  )
  return (
    <QdsDialogContextProvider value={qdsDialogApi}>
      <CoreDialog.Root {...props} />
    </QdsDialogContextProvider>
  )
}
