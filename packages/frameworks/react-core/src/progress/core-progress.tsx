// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

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

import {ProgressContextProvider, useProgressContext} from "./progress-context"

export interface CoreProgressRootProps
  extends ProgressApiProps,
    Omit<ElementRenderProp<"div">, "defaultValue" | "dir"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function CoreProgressRoot({
  children,
  ...props
}: CoreProgressRootProps): ReactElement {
  const [progressProps, localProps] = splitProgressProps(props)
  const machine = useMachine(progressMachine, progressProps)
  const api = createProgressApi(machine, normalizeProps)

  const mergedProps = mergeProps(api.getRootBindings(), localProps)

  return (
    <ProgressContextProvider value={api}>
      <PolymorphicElement as="div" {...mergedProps}>
        {children}
      </PolymorphicElement>
    </ProgressContextProvider>
  )
}

export interface CoreProgressBarProps extends ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function CoreProgressBar({
  children,
  ...props
}: CoreProgressBarProps): ReactElement {
  const context = useProgressContext()
  const mergedProps = mergeProps(context.getBarBindings(), props)

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}

export interface CoreProgressLabelProps
  extends IdProp,
    ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function CoreProgressLabel({
  children,
  id: idProp,
  ...props
}: CoreProgressLabelProps): ReactElement {
  const context = useProgressContext()
  const mergedProps = mergeProps(
    context.getLabelBindings({id: useControlledId(idProp)}),
    props,
  )

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}

export interface CoreProgressTrackProps
  extends IdProp,
    ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function CoreProgressTrack({
  children,
  id,
  ...props
}: CoreProgressTrackProps): ReactElement {
  const context = useProgressContext()
  const mergedProps = mergeProps(
    context.getTrackBindings({
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

export interface CoreProgressValueTextProps extends ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function CoreProgressValueText({
  children,
  ...props
}: CoreProgressValueTextProps): ReactElement {
  const context = useProgressContext()
  const mergedProps = mergeProps(context.getValueTextBindings(), props)

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}

export interface CoreProgressErrorTextProps
  extends IdProp,
    ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function CoreProgressErrorText({
  children,
  id,
  ...props
}: CoreProgressErrorTextProps): ReactElement {
  const context = useProgressContext()

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

export interface CoreProgressHintProps
  extends IdProp,
    ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function CoreProgressHint({
  children,
  id,
  ...props
}: CoreProgressHintProps): ReactElement {
  const context = useProgressContext()

  const mergedProps = mergeProps(
    context.getHintBindings({
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
