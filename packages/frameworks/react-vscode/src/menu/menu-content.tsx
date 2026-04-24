import type {ReactElement, ReactNode} from "react"

import {useMenuContent} from "@qualcomm-ui/react-core/menu"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface MenuContentProps extends ElementRenderProp<"div"> {
  children?: ReactNode
}

export function MenuContent({
  children,
  id,
  ...props
}: MenuContentProps): ReactElement | null {
  const contextProps = useMenuContent({id})
  if (contextProps === null) {
    return null
  }
  const mergedProps = mergeProps(
    contextProps,
    {className: "vs-menu__root"},
    props,
  )
  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
