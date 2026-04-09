// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {
  createStepperApi,
  splitStepperProps,
  type StepperApi,
  type StepperApiProps,
  type StepperItemProps,
  stepperMachine,
  type StepperNextTriggerBindings,
  type StepperPrevTriggerBindings,
} from "@qualcomm-ui/core/stepper"
import {useOnDestroy} from "@qualcomm-ui/react-core/effects"
import {normalizeProps, useMachine} from "@qualcomm-ui/react-core/machine"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import {
  bindingRenderProp,
  type BindingRenderProp,
  type ElementRenderProp,
  type IdProp,
  PolymorphicElement,
  type RenderProp,
  renderProp,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {StepperContextProvider, useStepperContext} from "./stepper-context"
import {
  StepperItemContextProvider,
  useStepperItemContext,
} from "./stepper-item-context"

export interface CoreStepperRootProviderProps extends ElementRenderProp<"div"> {
  value: StepperApi
}

export function CoreStepperRootProvider({
  children,
  id,
  value,
  ...props
}: CoreStepperRootProviderProps): ReactElement {
  const mergedProps = mergeProps(
    value.getRootBindings({
      id: useControlledId(id),
      onDestroy: useOnDestroy(),
    }),
    props,
  )

  return (
    <StepperContextProvider value={value}>
      <PolymorphicElement as="div" {...mergedProps}>
        {children}
      </PolymorphicElement>
    </StepperContextProvider>
  )
}

export interface CoreStepperRootProps
  extends StepperApiProps,
    Omit<ElementRenderProp<"div">, "defaultValue" | "dir"> {}

export function CoreStepperRoot({
  children,
  ...props
}: CoreStepperRootProps): ReactElement {
  const [stepperProps, localProps] = splitStepperProps(props)
  const machine = useMachine(stepperMachine, stepperProps)
  const stepperApi = createStepperApi(machine, normalizeProps)
  const mergedProps = mergeProps(
    stepperApi.getRootBindings({
      id: useControlledId(localProps.id),
      onDestroy: useOnDestroy(),
    }),
    localProps,
  )

  return (
    <StepperContextProvider value={stepperApi}>
      <PolymorphicElement as="div" {...mergedProps}>
        {children}
      </PolymorphicElement>
    </StepperContextProvider>
  )
}

export interface CoreStepperListProps extends IdProp, ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function CoreStepperList({
  children,
  id,
  ...props
}: CoreStepperListProps): ReactElement {
  const stepperContext = useStepperContext()
  const mergedProps = mergeProps(
    stepperContext.getListBindings({
      id: useControlledId(id),
      onDestroy: useOnDestroy(),
    }),
    props,
  )

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}

export interface CoreStepperItemProps
  extends StepperItemProps,
    ElementRenderProp<"div"> {}

export function CoreStepperItem({
  children,
  ...props
}: CoreStepperItemProps): ReactElement {
  const stepperContext = useStepperContext()
  const {index}: StepperItemProps = props
  const mergedProps = mergeProps(stepperContext.getItemBindings({index}), props)

  return (
    <StepperItemContextProvider value={{index}}>
      <PolymorphicElement as="div" {...mergedProps}>
        {children}
      </PolymorphicElement>
    </StepperItemContextProvider>
  )
}

export interface CoreStepperTriggerProps
  extends IdProp,
    ElementRenderProp<"button"> {}

export function CoreStepperTrigger({
  children,
  id,
  ...props
}: CoreStepperTriggerProps): ReactElement {
  const stepperContext = useStepperContext()
  const itemProps = useStepperItemContext()
  const mergedProps = mergeProps(
    stepperContext.getTriggerBindings({
      ...itemProps,
      id: useControlledId(id),
      onDestroy: useOnDestroy(),
    }),
    props,
  )

  return (
    <PolymorphicElement as="button" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}

export interface CoreStepperLabelProps extends ElementRenderProp<"span"> {}

export function CoreStepperLabel({
  children,
  ...props
}: CoreStepperLabelProps): ReactElement {
  const stepperContext = useStepperContext()
  const itemProps = useStepperItemContext()
  const mergedProps = mergeProps(
    stepperContext.getLabelBindings(itemProps),
    props,
  )

  return (
    <PolymorphicElement as="span" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}

export interface CoreStepperHintProps extends ElementRenderProp<"span"> {}

export function CoreStepperHint({
  children,
  ...props
}: CoreStepperHintProps): ReactElement {
  const stepperContext = useStepperContext()
  const itemProps = useStepperItemContext()
  const mergedProps = mergeProps(
    stepperContext.getHintBindings(itemProps),
    props,
  )

  return (
    <PolymorphicElement as="span" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}

export interface CoreStepperIndicatorProps extends ElementRenderProp<"div"> {}

export function CoreStepperIndicator({
  children,
  ...props
}: CoreStepperIndicatorProps): ReactElement {
  const stepperContext = useStepperContext()
  const itemProps = useStepperItemContext()
  const mergedProps = mergeProps(
    stepperContext.getIndicatorBindings(itemProps),
    props,
  )

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}

export interface CoreStepperSeparatorProps extends ElementRenderProp<"div"> {}

export function CoreStepperSeparator({
  children,
  ...props
}: CoreStepperSeparatorProps): ReactElement {
  const stepperContext = useStepperContext()
  const itemProps = useStepperItemContext()
  const mergedProps = mergeProps(
    stepperContext.getSeparatorBindings(itemProps),
    props,
  )

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}

export interface CoreStepperCompletedContentProps
  extends ElementRenderProp<"div"> {}

export function CoreStepperCompletedContent({
  children,
  ...props
}: CoreStepperCompletedContentProps): ReactElement {
  const stepperContext = useStepperContext()
  const mergedProps = mergeProps(
    stepperContext.getCompletedContentBindings(),
    props,
  )

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}

export interface CoreStepperContentProps
  extends StepperItemProps,
    IdProp,
    ElementRenderProp<"div"> {}

export function CoreStepperContent({
  children,
  id,
  ...props
}: CoreStepperContentProps): ReactElement {
  const stepperContext = useStepperContext()
  const mergedProps = mergeProps(
    stepperContext.getContentBindings({
      ...props,
      id: useControlledId(id),
      onDestroy: useOnDestroy(),
    }),
    props,
  )

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}

export interface CoreStepperNextTriggerProps {
  children: BindingRenderProp<StepperNextTriggerBindings>
}

export function CoreStepperNextTrigger({
  children,
}: CoreStepperNextTriggerProps): ReactElement {
  const stepperContext = useStepperContext()

  return bindingRenderProp(children, stepperContext.getNextTriggerBindings())
}

export interface CoreStepperPrevTriggerProps {
  children: BindingRenderProp<StepperPrevTriggerBindings>
}

export function CoreStepperPrevTrigger({
  children,
}: CoreStepperPrevTriggerProps): ReactElement {
  const stepperContext = useStepperContext()

  return bindingRenderProp(children, stepperContext.getPrevTriggerBindings())
}

export interface CoreStepperContextProps {
  /**
   * {@link https://react-next.qui.qualcomm.com/render-props Render Prop}
   * that provides the current {@link StepperApi} context.
   *
   * @inheritDoc
   */
  children: RenderProp<StepperApi>
}

export function CoreStepperContext({
  children,
}: CoreStepperContextProps): ReactNode {
  const context = useStepperContext()
  return renderProp(children, context)
}
