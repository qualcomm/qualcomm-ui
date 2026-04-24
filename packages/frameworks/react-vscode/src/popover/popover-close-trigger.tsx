import type {ReactElement} from "react"

import type {PopoverCloseTriggerBindings} from "@qualcomm-ui/core/popover"
import {usePopoverCloseTrigger} from "@qualcomm-ui/react-core/popover"
import {
  type BindingRenderProp,
  bindingRenderProp,
} from "@qualcomm-ui/react-core/system"

export interface PopoverCloseTriggerProps {
  children: BindingRenderProp<PopoverCloseTriggerBindings>
  id?: string
}

export function PopoverCloseTrigger({
  children,
  id,
}: PopoverCloseTriggerProps): ReactElement {
  const contextProps = usePopoverCloseTrigger({id})
  return bindingRenderProp(children, contextProps)
}
