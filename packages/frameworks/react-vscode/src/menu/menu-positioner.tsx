import type {ReactElement, ReactNode} from "react"

import {useMenuPositioner} from "@qualcomm-ui/react-core/menu"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface MenuPositionerProps extends ElementRenderProp<"div"> {
  children?: ReactNode
}

export function MenuPositioner({
  children,
  id,
  ...props
}: MenuPositionerProps): ReactElement | null {
  const contextProps = useMenuPositioner({id})
  if (!contextProps) {
    return null
  }
  const mergedProps = mergeProps(
    contextProps,
    {className: "vs-menu__positioner"},
    props,
  )

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
