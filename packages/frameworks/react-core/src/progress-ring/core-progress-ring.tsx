// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ComponentPropsWithRef, ReactElement, ReactNode} from "react"

import {
  createProgressApi,
  type ProgressApiProps,
  progressMachine,
  splitProgressProps,
} from "@qualcomm-ui/core/progress"
import {useOnDestroy} from "@qualcomm-ui/react-core/effects"
import {normalizeProps, useMachine} from "@qualcomm-ui/react-core/machine"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import {
  type ElementRenderProp,
  type IdProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {
  ProgressRingContextProvider,
  useProgressRingContext,
} from "./progress-ring-context"

export interface CoreProgressRingRootProps
  extends ProgressApiProps,
    Omit<ElementRenderProp<"div">, "defaultValue" | "dir"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function CoreProgressRingRoot({
  children,
  ...props
}: CoreProgressRingRootProps): ReactElement {
  const [progressProps, localProps] = splitProgressProps(props)
  const machine = useMachine(progressMachine, progressProps)
  const api = createProgressApi(machine, normalizeProps)

  const mergedProps = mergeProps(api.getRingRootBindings(), localProps)

  return (
    <ProgressRingContextProvider value={api}>
      <PolymorphicElement as="div" {...mergedProps}>
        {children}
      </PolymorphicElement>
    </ProgressRingContextProvider>
  )
}

export interface CoreProgressRingLabelProps
  extends IdProp,
    ElementRenderProp<"label"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function CoreProgressRingLabel({
  children,
  id: idProp,
  ...props
}: CoreProgressRingLabelProps): ReactElement {
  const context = useProgressRingContext()
  const mergedProps = mergeProps(
    context.getLabelBindings({id: useControlledId(idProp)}),
    props,
  )

  return (
    <PolymorphicElement as="label" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}

export interface CoreProgressRingBarProps
  extends ComponentPropsWithRef<"circle"> {}

export function CoreProgressRingBar(
  props: CoreProgressRingBarProps,
): ReactElement {
  const context = useProgressRingContext()
  const mergedProps = mergeProps(context.getRingBarBindings(), props)

  return <circle {...mergedProps} />
}

export interface CoreProgressRingTrackProps
  extends ComponentPropsWithRef<"circle"> {}

export function CoreProgressRingTrack(
  props: CoreProgressRingTrackProps,
): ReactElement {
  const context = useProgressRingContext()
  const mergedProps = mergeProps(context.getRingTrackBindings(), props)

  return <circle {...mergedProps} />
}

export interface CoreProgressRingCircleProps
  extends IdProp,
    ComponentPropsWithRef<"svg"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function CoreProgressRingCircle({
  children,
  id,
  ...props
}: CoreProgressRingCircleProps): ReactElement {
  const context = useProgressRingContext()
  const mergedProps = mergeProps(
    context.getRingCircleBindings({
      id: useControlledId(id),
      onDestroy: useOnDestroy(),
    }),
    props,
  )

  return <svg {...mergedProps}>{children}</svg>
}

export interface CoreProgressRingValueTextProps
  extends ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function CoreProgressRingValueText({
  children,
  ...props
}: CoreProgressRingValueTextProps): ReactElement {
  const context = useProgressRingContext()
  const mergedProps = mergeProps(context.getValueTextBindings(), props)

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}

export interface CoreProgressRingErrorTextProps
  extends IdProp,
    ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function CoreProgressRingErrorText({
  children,
  id,
  ...props
}: CoreProgressRingErrorTextProps): ReactElement {
  const context = useProgressRingContext()

  const mergedProps = mergeProps(
    context.getErrorTextBindings({
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
