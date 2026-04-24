import type {ReactElement, ReactNode} from "react"

import {useMenuOptionItemControl} from "@qualcomm-ui/react-core/menu"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {Icon} from "../icon"

export interface MenuCheckboxItemControlProps extends ElementRenderProp<"div"> {
  children?: ReactNode
}

export function MenuCheckboxItemControl({
  children = <Icon icon="check" />,
  ...props
}: MenuCheckboxItemControlProps): ReactElement {
  const contextProps = useMenuOptionItemControl()
  const mergedProps = mergeProps(
    contextProps,
    {className: "vs-menu-item__control"},
    props,
  )

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
