import type {ReactElement, ReactNode} from "react"

import {type ItemProps, splitMenuItemProps} from "@qualcomm-ui/core/menu"
import {
  MenuItemContextProvider,
  useMenuItem,
} from "@qualcomm-ui/react-core/menu"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {type CodiconOrElement, IconOrElement} from "../icon"

export interface MenuItemProps
  extends ItemProps, Omit<ElementRenderProp<"button">, "onSelect" | "value"> {
  children?: ReactNode
  endIcon?: CodiconOrElement
  startIcon?: CodiconOrElement
}

export function MenuItem({
  children,
  endIcon,
  startIcon,
  ...props
}: MenuItemProps): ReactElement {
  const [menuItemProps, localProps] = splitMenuItemProps(props)
  const {bindings, itemContextValue} = useMenuItem(menuItemProps)
  const mergedProps = mergeProps(
    bindings,
    {className: "vs-menu-item__root"},
    localProps,
  )

  return (
    <MenuItemContextProvider value={itemContextValue}>
      <PolymorphicElement as="button" {...mergedProps}>
        {startIcon ? <IconOrElement icon={startIcon} /> : <span />}
        {children}
        {endIcon ? (
          <IconOrElement className="vs-menu-item__end-icon" icon={endIcon} />
        ) : null}
      </PolymorphicElement>
    </MenuItemContextProvider>
  )
}
