import type {ReactElement} from "react"

import {useTooltipTrigger} from "@qualcomm-ui/react-core/tooltip"
import type {TooltipTriggerBindings} from "@qualcomm-ui/core/tooltip"
import type {BindingRenderProp} from "@qualcomm-ui/react-core/system"
import {bindingRenderProp} from "@qualcomm-ui/react-core/system"

/**
 * @public
 */
export interface TooltipTriggerProps {
  children: BindingRenderProp<TooltipTriggerBindings>
}

export function TooltipTrigger({children}: TooltipTriggerProps): ReactElement {
  const bindings = useTooltipTrigger({})
  return bindingRenderProp(children, bindings)
}
