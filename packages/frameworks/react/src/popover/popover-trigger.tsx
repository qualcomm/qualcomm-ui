// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import type {PopoverTriggerBindings} from "@qualcomm-ui/core/popover"
import {popoverClasses} from "@qualcomm-ui/qds-core/popover"
import {usePopoverTrigger} from "@qualcomm-ui/react-core/popover"
import {type BindingRenderProp, bindingRenderProp} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface PopoverTriggerProps {
  /**
   * React children {@link
   * https://react-next.qui.qualcomm.com/render-props#binding-render-prop
   * Render Prop}
   *
   * @inheritDoc
   */
  children: BindingRenderProp<PopoverTriggerBindings & {className: string}>

  /**
   * Optional id attribute.
   */
  id?: string
}

/**
 * A trigger that opens the popover.  Doesn't render anything by itself. Applies
 * event handlers and attributes to the child element.
 */
export function PopoverTrigger({
  children,
  id,
  ...props
}: PopoverTriggerProps): ReactElement {
  const contextProps = usePopoverTrigger({id})
  const mergedProps = mergeProps(
    contextProps,
    {className: popoverClasses.trigger},
    props,
  )

  return bindingRenderProp(children, mergedProps)
}
