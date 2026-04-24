import type {ReactElement, ReactNode} from "react"

import {usePopoverDescription} from "@qualcomm-ui/react-core/popover"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface PopoverDescriptionProps extends ElementRenderProp<"div"> {
  children?: ReactNode
  id?: string
}

export function PopoverDescription({
  children,
  id,
  ...props
}: PopoverDescriptionProps): ReactElement {
  const contextProps = usePopoverDescription({id})
  const mergedProps = mergeProps(
    contextProps,
    {className: "vs-popover__description"},
    props,
  )
  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
