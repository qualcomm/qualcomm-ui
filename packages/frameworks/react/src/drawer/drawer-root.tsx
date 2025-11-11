// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, type ReactNode, useMemo} from "react"

import {createQdsDialogApi} from "@qualcomm-ui/qds-core/dialog"
import {createQdsDrawerApi, type QdsDrawerApiProps} from "@qualcomm-ui/qds-core/drawer"
import {QdsDialogContextProvider} from "@qualcomm-ui/react/dialog"
import {CoreDialog, type CoreDialogRootProps} from "@qualcomm-ui/react-core/dialog"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"

import {QdsDrawerContextProvider} from "./qds-drawer-context"

export interface DrawerRootProps
  extends CoreDialogRootProps,
    QdsDrawerApiProps {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children: ReactNode
}

/**
 * Groups all parts of the drawer. Doesn't render its own HTML element.
 */
export function DrawerRoot({
  placement,
  scrollBehavior,
  size,
  ...props
}: DrawerRootProps): ReactElement {
  const qdsDialogApi = useMemo(
    () =>
      createQdsDialogApi(
        {emphasis: "neutral", placement: "top", scrollBehavior, size},
        normalizeProps,
      ),
    [scrollBehavior, size],
  )

  const qdsDrawerApi = useMemo(
    () => createQdsDrawerApi({placement, scrollBehavior, size}, normalizeProps),
    [placement, scrollBehavior, size],
  )

  return (
    <QdsDialogContextProvider value={qdsDialogApi}>
      <QdsDrawerContextProvider value={qdsDrawerApi}>
        <CoreDialog.Root {...props} />
      </QdsDrawerContextProvider>
    </QdsDialogContextProvider>
  )
}
