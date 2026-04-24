import type {ReactElement, ReactNode} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface MenuItemDescriptionProps extends ElementRenderProp<"div"> {
  children?: ReactNode
}

export function MenuItemDescription({
  children,
  ...props
}: MenuItemDescriptionProps): ReactElement {
  const mergedProps = mergeProps(
    {className: "vs-menu-item__description"},
    props,
  )

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
