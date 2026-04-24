import type {ReactElement, ReactNode} from "react"

import {type ItemProps, splitMenuItemProps} from "@qualcomm-ui/core/menu"
import {
  MenuItemContextProvider,
  MenuOptionItemContextProvider,
  useMenuRadioItem,
} from "@qualcomm-ui/react-core/menu"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface MenuRadioItemProps
  extends ItemProps, Omit<ElementRenderProp<"button">, "onSelect" | "value"> {
  children?: ReactNode
}

export function MenuRadioItem({
  children,
  ...props
}: MenuRadioItemProps): ReactElement {
  const [radioItemProps, localProps] = splitMenuItemProps(props)
  const {bindings, optionItemContextValue} = useMenuRadioItem(radioItemProps)
  const mergedProps = mergeProps(
    bindings,
    {className: "vs-menu-item__root vs-menu-item--radio"},
    localProps,
  )

  return (
    <MenuOptionItemContextProvider value={optionItemContextValue}>
      <MenuItemContextProvider value={optionItemContextValue}>
        <PolymorphicElement as="button" {...mergedProps}>
          {children}
        </PolymorphicElement>
      </MenuItemContextProvider>
    </MenuOptionItemContextProvider>
  )
}
