import type {ReactElement, ReactNode} from "react"

import {type ItemProps, splitMenuItemProps} from "@qualcomm-ui/core/menu"
import {
  MenuItemContextProvider,
  useMenuTriggerItem,
} from "@qualcomm-ui/react-core/menu"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {type CodiconOrElement, IconOrElement} from "../icon"

export interface MenuTriggerItemProps
  extends ItemProps, Omit<ElementRenderProp<"button">, "onSelect" | "value"> {
  children?: ReactNode

  /**
   * Icon to display next to the label, which indicates that this menu item is a
   * trigger for a submenu.
   *
   * @default "chevron-right"
   */
  icon?: CodiconOrElement
}

/**
 * A menu item that triggers a submenu on hover or click. Renders a `<button>`
 * element by default.
 */
export function MenuTriggerItem({
  children,
  icon = "chevron-right",
  id,
  ...props
}: MenuTriggerItemProps): ReactElement {
  const [menuItemProps, localProps] = splitMenuItemProps(props)
  const context = useMenuTriggerItem({id, ...menuItemProps})
  const mergedProps = mergeProps(
    context.bindings ?? {},
    {className: "vs-menu-item__root vs-menu-item--trigger"},
    localProps,
  )

  return (
    <MenuItemContextProvider value={context.itemContextValue}>
      <PolymorphicElement as="button" {...mergedProps}>
        {children}
        <IconOrElement className="vs-menu-item__end-icon" icon={icon} />
      </PolymorphicElement>
    </MenuItemContextProvider>
  )
}
