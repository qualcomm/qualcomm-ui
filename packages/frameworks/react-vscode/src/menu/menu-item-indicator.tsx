import type {ReactElement, ReactNode} from "react"

import {useMenuItemIndicator} from "@qualcomm-ui/react-core/menu"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {Icon} from "../icon"

export interface MenuItemIndicatorProps extends ElementRenderProp<"div"> {
  children?: ReactNode
}

export function MenuItemIndicator({
  children,
  ...props
}: MenuItemIndicatorProps): ReactElement {
  const contextProps = useMenuItemIndicator()
  const mergedProps = mergeProps(
    contextProps,
    {className: "vs-menu-item__indicator"},
    props,
  )

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children ?? <Icon icon="check" />}
    </PolymorphicElement>
  )
}
