// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, type ReactNode, useMemo} from "react"

import type {MenuApiProps} from "@qualcomm-ui/core/menu"
import {
  type PresenceApiProps,
  splitPresenceProps,
} from "@qualcomm-ui/core/presence"
import {
  createQdsMenuApi,
  type QdsMenuApiProps,
} from "@qualcomm-ui/qds-core/menu"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {
  MenuContextProvider,
  MenuMachineContextProvider,
  MenuTriggerContextProvider,
  useMenu,
} from "@qualcomm-ui/react-core/menu"
import {
  PresenceContextProvider,
  usePresence,
} from "@qualcomm-ui/react-core/presence"
import type {Optional} from "@qualcomm-ui/utils/guard"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {QdsMenuContextProvider, useQdsMenuContext} from "./qds-menu-context"

export interface MenuRootProps
  extends Optional<MenuApiProps, "id">,
    PresenceApiProps,
    QdsMenuApiProps {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children: ReactNode
}

export function MenuRoot({
  children,
  size,
  ...props
}: MenuRootProps): ReactElement {
  const [presenceProps, menuProps] = splitPresenceProps(props)
  const {api, machine, triggerItemContext} = useMenu(menuProps)
  const presenceApi = usePresence(
    mergeProps({present: api.open}, presenceProps),
  )
  const qdsContext = useQdsMenuContext(false)
  const qdsContextValue = useMemo(
    () => createQdsMenuApi({size: size || qdsContext?.size}, normalizeProps),
    [qdsContext?.size, size],
  )

  return (
    <MenuTriggerContextProvider value={triggerItemContext}>
      <MenuMachineContextProvider value={machine}>
        <MenuContextProvider value={api}>
          <PresenceContextProvider value={presenceApi}>
            <QdsMenuContextProvider value={qdsContextValue}>
              {children}
            </QdsMenuContextProvider>
          </PresenceContextProvider>
        </MenuContextProvider>
      </MenuMachineContextProvider>
    </MenuTriggerContextProvider>
  )
}
