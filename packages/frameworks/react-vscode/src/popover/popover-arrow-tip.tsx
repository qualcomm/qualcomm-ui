import type {ReactElement, ReactNode} from "react"

import {usePopoverArrowTip} from "@qualcomm-ui/react-core/popover"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface PopoverArrowTipProps extends ElementRenderProp<"div"> {
  children?: ReactNode
}

export function PopoverArrowTip({
  children,
  ...props
}: PopoverArrowTipProps): ReactElement {
  const contextProps = usePopoverArrowTip()
  const mergedProps = mergeProps(
    contextProps,
    {className: "vs-popover__arrow-tip"},
    props,
  )
  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
