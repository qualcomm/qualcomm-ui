import type {ReactElement} from "react"

import type {TooltipTriggerBindings} from "@qualcomm-ui/core/tooltip"
import {
  type BindingRenderProp,
  bindingRenderProp,
  type IdProp,
} from "@qualcomm-ui/react-core/system"
import {useTooltipTrigger} from "@qualcomm-ui/react-core/tooltip"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface TooltipTriggerProps extends IdProp {
  children: BindingRenderProp<TooltipTriggerBindings>
}

/**
 * A trigger that opens the tooltip. Applies event handlers and attributes to
 * the child element. Doesn't render anything by itself.
 */
export function TooltipTrigger({
  children,
  id,
  ...props
}: TooltipTriggerProps): ReactElement | null {
  const contextProps = useTooltipTrigger({id})
  const mergedProps = mergeProps(contextProps, props)
  return bindingRenderProp(children, mergedProps)
}
