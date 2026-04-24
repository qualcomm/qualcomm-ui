import type {ReactElement, ReactNode} from "react"

import {
  type ElementRenderProp,
  type IdProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {useTooltipContent} from "@qualcomm-ui/react-core/tooltip"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface TooltipContentProps extends IdProp, ElementRenderProp<"div"> {
  children?: ReactNode
}

/**
 * The content of the tooltip which is displayed relative to the trigger.
 * Renders a `<div>` element by default.
 */
export function TooltipContent({
  children,
  id,
  ...props
}: TooltipContentProps): ReactElement {
  const contextProps = useTooltipContent({id})
  const mergedProps = mergeProps(
    contextProps,
    {className: "vs-tooltip__content"},
    props,
  )
  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
