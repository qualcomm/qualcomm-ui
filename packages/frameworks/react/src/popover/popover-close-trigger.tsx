// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import type {PopoverCloseTriggerBindings} from "@qualcomm-ui/core/popover"
import {usePopoverCloseTrigger} from "@qualcomm-ui/react-core/popover"
import {type BindingRenderProp, bindingRenderProp} from "@qualcomm-ui/react-core/system"

export interface PopoverCloseTriggerProps {
  /**
   * React children {@link
   * https://react-next.qui.qualcomm.com/render-props#binding-render-prop
   * Render Prop}
   *
   * @inheritDoc
   */
  children: BindingRenderProp<PopoverCloseTriggerBindings>

  /**
   * {@link https://www.w3schools.com/html/html_id.asp id attribute}. If
   * omitted, a unique identifier will be automatically generated for accessibility.
   */
  id?: string
}

export function PopoverCloseTrigger({
  children,
  id,
}: PopoverCloseTriggerProps): ReactElement {
  const contextProps = usePopoverCloseTrigger({id})

  return bindingRenderProp(children, contextProps)
}
