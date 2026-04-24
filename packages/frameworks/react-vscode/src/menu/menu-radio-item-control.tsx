import type {ReactElement, ReactNode} from "react"

import {useMenuOptionItemControl} from "@qualcomm-ui/react-core/menu"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface MenuRadioItemControlProps extends ElementRenderProp<"div"> {
  children?: ReactNode
}

export function MenuRadioItemControl({
  children,
  ...props
}: MenuRadioItemControlProps): ReactElement {
  const contextProps = useMenuOptionItemControl()

  const mergedProps = mergeProps(
    contextProps,
    {className: "vs-menu-item__indicator"},
    props,
  )

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
