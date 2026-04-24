import type {ReactElement, ReactNode} from "react"

import {useMenuItemLabel} from "@qualcomm-ui/react-core/menu"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface MenuItemLabelProps extends ElementRenderProp<"div"> {
  children?: ReactNode
}

export function MenuItemLabel({
  children,
  ...props
}: MenuItemLabelProps): ReactElement {
  const contextProps = useMenuItemLabel()
  const mergedProps = mergeProps(
    contextProps,
    {className: "vs-menu-item__label"},
    props,
  )

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
