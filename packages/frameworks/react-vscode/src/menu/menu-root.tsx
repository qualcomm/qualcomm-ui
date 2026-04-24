import type {ReactElement, ReactNode} from "react"

import type {MenuApiProps} from "@qualcomm-ui/core/menu"
import {
  type PresenceApiProps,
  splitPresenceProps,
} from "@qualcomm-ui/core/presence"
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

export interface MenuRootProps
  extends Optional<MenuApiProps, "id">, PresenceApiProps {
  children: ReactNode
}

export function MenuRoot({children, ...props}: MenuRootProps): ReactElement {
  const [presenceProps, menuProps] = splitPresenceProps(props)
  const {api, machine, triggerItemContext} = useMenu(menuProps)
  const presenceApi = usePresence(
    mergeProps({present: api.open}, presenceProps),
  )

  return (
    <MenuMachineContextProvider value={machine}>
      <MenuContextProvider value={api}>
        <MenuTriggerContextProvider value={triggerItemContext}>
          <PresenceContextProvider value={presenceApi}>
            {children}
          </PresenceContextProvider>
        </MenuTriggerContextProvider>
      </MenuContextProvider>
    </MenuMachineContextProvider>
  )
}
