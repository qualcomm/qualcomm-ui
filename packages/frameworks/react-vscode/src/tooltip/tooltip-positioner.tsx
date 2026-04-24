import type {ReactElement, ReactNode} from "react"

import {
  type ElementRenderProp,
  type IdProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {useTooltipPositioner} from "@qualcomm-ui/react-core/tooltip"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface TooltipPositionerProps
  extends IdProp, ElementRenderProp<"div"> {
  children?: ReactNode
}

/**
 * The element that positions the tooltip content relative to the trigger.
 * Renders a `<div>` element by default.
 */
export function TooltipPositioner({
  children,
  id,
  ...props
}: TooltipPositionerProps): ReactElement {
  const contextProps = useTooltipPositioner({id})
  const mergedProps = mergeProps(
    contextProps,
    {className: "vs-tooltip__positioner"},
    props,
  )
  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
