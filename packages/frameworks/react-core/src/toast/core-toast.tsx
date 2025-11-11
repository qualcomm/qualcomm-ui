// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import type {
  ToastActionTriggerBindings,
  ToastCloseTriggerBindings,
} from "@qualcomm-ui/core/toast"
import {
  type BindingRenderProp,
  bindingRenderProp,
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useToastContext} from "./toast-context"

export interface CoreToastRootProps extends ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function CoreToastRoot({
  children,
  ...props
}: CoreToastRootProps): ReactElement {
  const context = useToastContext()
  const mergedProps = mergeProps(context.getRootBindings(), props)
  return (
    <PolymorphicElement as="div" {...mergedProps}>
      <div {...context.getGhostBeforeBindings()}></div>
      {children}
      <div {...context.getGhostAfterBindings()}></div>
    </PolymorphicElement>
  )
}

export interface CoreToastLabelProps extends ElementRenderProp<"div"> {}

export function CoreToastLabel(props: CoreToastLabelProps): ReactElement {
  const context = useToastContext()
  const mergedProps = mergeProps(context.getLabelBindings(), props)

  return <PolymorphicElement as="div" {...mergedProps} />
}

export interface CoreToastDescriptionProps extends ElementRenderProp<"div"> {}

export function CoreToastDescription(
  props: CoreToastDescriptionProps,
): ReactElement {
  const context = useToastContext()
  const mergedProps = mergeProps(context.getDescriptionBindings(), props)

  return <PolymorphicElement as="div" {...mergedProps} />
}

export interface CoreToastCloseTriggerProps {
  /**
   * Child element or {@link https://react-next.qui.qualcomm.com/render-props#binding-render-prop render function}
   * that receives merged props.
   * @inheritDoc
   */
  children: BindingRenderProp<ToastCloseTriggerBindings>
}

export function CoreToastCloseTrigger({
  children,
  ...props
}: CoreToastCloseTriggerProps): ReactNode {
  const context = useToastContext()
  const mergedProps = mergeProps(context.getCloseTriggerBindings(), props)

  return bindingRenderProp(children, mergedProps)
}

export interface CoreToastActionTriggerProps {
  /**
   * Child element or {@link https://react-next.qui.qualcomm.com/render-props#binding-render-prop render function}
   * that receives merged props.
   * @inheritDoc
   */
  children: BindingRenderProp<ToastActionTriggerBindings>
}

export function CoreToastActionTrigger({
  children,
  ...props
}: CoreToastActionTriggerProps): ReactNode {
  const context = useToastContext()
  const mergedProps = mergeProps(context.getActionTriggerBindings(), props)

  return bindingRenderProp(children, mergedProps)
}
