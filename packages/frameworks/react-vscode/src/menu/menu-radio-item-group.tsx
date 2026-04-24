import type {ReactElement, ReactNode} from "react"

import type {RadioItemGroupContext} from "@qualcomm-ui/core/menu"
import {
  MenuRadioItemGroupContextProvider,
  useMenuRadioItemGroup,
} from "@qualcomm-ui/react-core/menu"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import type {Optional} from "@qualcomm-ui/utils/guard"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface MenuRadioItemGroupProps
  extends Optional<RadioItemGroupContext, "id">, ElementRenderProp<"div"> {
  children?: ReactNode
}

export function MenuRadioItemGroup({
  children,
  id,
  onValueChange,
  value,
  ...props
}: MenuRadioItemGroupProps): ReactElement {
  const {bindings, itemGroupContextValue} = useMenuRadioItemGroup({
    id,
    onValueChange,
    value,
  })
  const mergedProps = mergeProps(
    bindings,
    {className: "vs-menu__radio-item-group"},
    props,
  )

  return (
    <MenuRadioItemGroupContextProvider value={itemGroupContextValue}>
      <PolymorphicElement as="div" {...mergedProps}>
        {children}
      </PolymorphicElement>
    </MenuRadioItemGroupContextProvider>
  )
}
