import type {ReactElement, ReactNode} from "react"

import {usePopoverIndicator} from "@qualcomm-ui/react-core/popover"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"

export interface PopoverIndicatorProps extends ElementRenderProp<"span"> {
  children?: ReactNode
}

export function PopoverIndicator({
  children,
  ...props
}: PopoverIndicatorProps): ReactElement {
  const contextProps = usePopoverIndicator()
  return (
    <PolymorphicElement as="span" {...contextProps} {...props}>
      {children}
    </PolymorphicElement>
  )
}
