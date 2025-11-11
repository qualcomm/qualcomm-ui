// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import type {TooltipTriggerBindings} from "@qualcomm-ui/core/tooltip"
import {
  bindingRenderProp,
  type BindingRenderProp,
  type IdProp,
} from "@qualcomm-ui/react-core/system"
import {useTooltipTrigger} from "@qualcomm-ui/react-core/tooltip"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface TooltipTriggerProps extends IdProp {
  /**
   * React children {@link
   * https://react-next.qui.qualcomm.com/render-props#binding-render-prop
   * Render Prop}
   *
   * @inheritDoc
   */
  children: BindingRenderProp<TooltipTriggerBindings>
}

/**
 * A trigger that opens the tooltip.  Doesn't render anything by itself. Applies
 * event handlers and attributes to the child element.
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
