import type {ReactElement, ReactNode} from "react"

import {usePopoverArrow} from "@qualcomm-ui/react-core/popover"
import {
  type ElementRenderProp,
  type IdProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {PopoverArrowTip} from "./popover-arrow-tip"

export interface PopoverArrowProps extends IdProp, ElementRenderProp<"div"> {
  children?: ReactNode
}

export function PopoverArrow({
  children = <PopoverArrowTip />,
  id,
  ...props
}: PopoverArrowProps): ReactElement {
  const contextProps = usePopoverArrow({id})
  const mergedProps = mergeProps(
    contextProps,
    {className: "vs-popover__arrow"},
    props,
  )
  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
