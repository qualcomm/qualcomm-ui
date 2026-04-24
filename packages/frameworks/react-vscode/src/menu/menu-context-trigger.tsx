import type {ReactElement, ReactNode} from "react"

import {useMenuContextTrigger} from "@qualcomm-ui/react-core/menu"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface MenuContextTriggerProps extends ElementRenderProp<"button"> {
  children?: ReactNode
}

export function MenuContextTrigger({
  children,
  id,
  ...props
}: MenuContextTriggerProps): ReactElement {
  const contextProps = useMenuContextTrigger({id})
  const mergedProps = mergeProps(contextProps, props)

  return (
    <PolymorphicElement as="button" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
