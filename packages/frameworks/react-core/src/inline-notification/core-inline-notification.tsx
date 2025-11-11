// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {
  createInlineNotificationApi,
  type InlineNotificationApiProps,
  inlineNotificationMachine,
  splitInlineNotificationProps,
} from "@qualcomm-ui/core/inline-notification"
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
  InlineNotificationContextProvider,
  useInlineNotificationContext,
} from "./inline-notification-context"

export interface CoreInlineNotificationRootProps
  extends InlineNotificationApiProps,
    IdProp,
    Omit<ElementRenderProp<"div">, "dir" | "role"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function CoreInlineNotificationRoot({
  children,
  id,
  ...props
}: CoreInlineNotificationRootProps): ReactElement {
  const [inlineNotificationProps, localProps] =
    splitInlineNotificationProps(props)
  const machine = useMachine(inlineNotificationMachine, inlineNotificationProps)
  const api = createInlineNotificationApi(machine, normalizeProps)

  const mergedProps = mergeProps(
    api.getRootBindings({
      id: useControlledId(id),
    }),
    localProps,
  )

  return (
    <InlineNotificationContextProvider value={api}>
      <PolymorphicElement as="div" {...mergedProps}>
        {children}
      </PolymorphicElement>
    </InlineNotificationContextProvider>
  )
}

export interface CoreInlineNotificationLabelProps
  extends ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function CoreInlineNotificationLabel({
  children,
  id,
  ...props
}: CoreInlineNotificationLabelProps): ReactElement {
  const context = useInlineNotificationContext()

  const mergedProps = mergeProps(
    context.getLabelBindings({
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

export interface CoreInlineNotificationDescriptionProps
  extends IdProp,
    ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function CoreInlineNotificationDescription({
  children,
  id,
  ...props
}: CoreInlineNotificationDescriptionProps): ReactElement {
  const context = useInlineNotificationContext()

  const mergedProps = mergeProps(
    context.getDescriptionBindings({
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
