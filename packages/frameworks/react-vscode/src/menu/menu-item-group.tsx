import type {ReactElement, ReactNode} from "react"

import {
  MenuItemGroupContextProvider,
  useMenuItemGroup,
} from "@qualcomm-ui/react-core/menu"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface MenuItemGroupProps extends ElementRenderProp<"div"> {
  children?: ReactNode
  id?: string
}

export function MenuItemGroup({
  children,
  id,
  ...props
}: MenuItemGroupProps): ReactElement {
  const {bindings, itemGroupContextValue} = useMenuItemGroup({id})
  const mergedProps = mergeProps(
    bindings,
    {className: "vs-menu__item-group"},
    props,
  )

  return (
    <MenuItemGroupContextProvider value={itemGroupContextValue}>
      <PolymorphicElement as="div" {...mergedProps}>
        {children}
      </PolymorphicElement>
    </MenuItemGroupContextProvider>
  )
}
