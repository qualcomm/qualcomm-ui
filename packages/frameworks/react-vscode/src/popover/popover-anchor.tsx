import type {ReactElement, ReactNode} from "react"

import {usePopoverAnchor} from "@qualcomm-ui/react-core/popover"
import {
  type ElementRenderProp,
  type IdProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface PopoverAnchorProps extends IdProp, ElementRenderProp<"div"> {
  children?: ReactNode
}

export function PopoverAnchor({
  children,
  id,
  ...props
}: PopoverAnchorProps): ReactElement {
  const contextProps = usePopoverAnchor({id})
  const mergedProps = mergeProps(contextProps, props)
  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
