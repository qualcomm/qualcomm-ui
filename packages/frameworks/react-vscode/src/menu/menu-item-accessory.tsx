import type {ReactElement, ReactNode} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface MenuItemAccessoryProps extends ElementRenderProp<"div"> {
  children?: ReactNode
}

export function MenuItemAccessory({
  children,
  ...props
}: MenuItemAccessoryProps): ReactElement {
  const mergedProps = mergeProps({className: "vs-menu-item__accessory"}, props)

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
