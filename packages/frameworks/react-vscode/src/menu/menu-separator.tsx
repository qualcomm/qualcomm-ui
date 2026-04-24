import type {ReactElement, ReactNode} from "react"

import {useMenuSeparator} from "@qualcomm-ui/react-core/menu"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface MenuSeparatorProps extends ElementRenderProp<"hr"> {
  children?: ReactNode
}

export function MenuSeparator({
  children,
  ...props
}: MenuSeparatorProps): ReactElement {
  const contextProps = useMenuSeparator()
  const mergedProps = mergeProps(
    contextProps,
    {className: "vs-menu__separator"},
    props,
  )

  return (
    <PolymorphicElement as="hr" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
