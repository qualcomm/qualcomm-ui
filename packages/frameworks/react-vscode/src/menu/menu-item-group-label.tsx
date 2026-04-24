import type {ReactElement, ReactNode} from "react"

import {useMenuItemGroupLabel} from "@qualcomm-ui/react-core/menu"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface MenuItemGroupLabelProps extends ElementRenderProp<"div"> {
  children?: ReactNode
}

export function MenuItemGroupLabel({
  children,
  ...props
}: MenuItemGroupLabelProps): ReactElement {
  const bindings = useMenuItemGroupLabel()
  const mergedProps = mergeProps(
    bindings,
    {className: "vs-menu__item-group-label"},
    props,
  )

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
