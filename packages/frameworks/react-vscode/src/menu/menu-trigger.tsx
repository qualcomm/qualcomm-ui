import type {ReactNode} from "react"

import type {MenuTriggerBindings} from "@qualcomm-ui/core/menu"
import {useMenuTrigger} from "@qualcomm-ui/react-core/menu"
import {
  type BindingRenderProp,
  bindingRenderProp,
} from "@qualcomm-ui/react-core/system"

export interface MenuTriggerProps {
  children: BindingRenderProp<MenuTriggerBindings>
  id?: string
}

export function MenuTrigger({children, id}: MenuTriggerProps): ReactNode {
  const menuTriggerBindings = useMenuTrigger({id})

  return bindingRenderProp(children, menuTriggerBindings)
}
