import type {ReactElement, ReactNode} from "react"

import {
  type CheckboxOptionItemProps,
  splitMenuOptionItemProps,
} from "@qualcomm-ui/core/menu"
import {
  MenuItemContextProvider,
  MenuOptionItemContextProvider,
  useMenuCheckboxItem,
} from "@qualcomm-ui/react-core/menu"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface MenuCheckboxItemProps
  extends
    CheckboxOptionItemProps,
    Omit<ElementRenderProp<"button">, "onSelect" | "value"> {
  children?: ReactNode
}

export function MenuCheckboxItem({
  children,
  ...props
}: MenuCheckboxItemProps): ReactElement {
  const [optionItemProps, localProps] = splitMenuOptionItemProps({
    ...props,
    type: "checkbox",
  })
  const {bindings, optionItemContextValue} =
    useMenuCheckboxItem(optionItemProps)
  const mergedProps = mergeProps(
    bindings,
    {className: "vs-menu-item__root vs-menu-item--checkbox"},
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
