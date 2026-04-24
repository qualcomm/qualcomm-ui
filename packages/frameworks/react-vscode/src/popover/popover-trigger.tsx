import type {ReactElement} from "react"

import type {PopoverTriggerBindings} from "@qualcomm-ui/core/popover"
import {usePopoverTrigger} from "@qualcomm-ui/react-core/popover"
import {
  type BindingRenderProp,
  bindingRenderProp,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface PopoverTriggerProps {
  children: BindingRenderProp<PopoverTriggerBindings & {className?: string}>
  id?: string
}

export function PopoverTrigger({
  children,
  id,
  ...props
}: PopoverTriggerProps): ReactElement {
  const contextProps = usePopoverTrigger({id})
  const mergedProps = mergeProps(contextProps, props)
  return bindingRenderProp(children, mergedProps)
}
