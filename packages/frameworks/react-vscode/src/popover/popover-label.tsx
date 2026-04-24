import type {ReactElement, ReactNode} from "react"

import {usePopoverLabel} from "@qualcomm-ui/react-core/popover"
import {
  type ElementRenderProp,
  type IdProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface PopoverLabelProps extends IdProp, ElementRenderProp<"div"> {
  children?: ReactNode
}

export function PopoverLabel({
  children,
  id,
  ...props
}: PopoverLabelProps): ReactElement {
  const contextProps = usePopoverLabel({id})
  const mergedProps = mergeProps(
    contextProps,
    {className: "vs-popover__label"},
    props,
  )
  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
