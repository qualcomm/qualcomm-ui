// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {
  type CollapsibleApi,
  type CollapsibleApiProps,
  collapsibleMachine,
  createCollapsibleApi,
  splitCollapsibleProps,
} from "@qualcomm-ui/core/collapsible"
import {useOnDestroy} from "@qualcomm-ui/react-core/effects"
import {normalizeProps, useMachine} from "@qualcomm-ui/react-core/machine"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import {
  type ElementRenderProp,
  type IdProp,
  PolymorphicElement,
  type RenderProp,
  renderProp,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {
  CollapsibleContextProvider,
  useCollapsibleContext,
} from "./collapsible-context"

export interface CoreCollapsibleRootProviderProps extends CollapsibleApiProps {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function CoreCollapsibleRootProvider({
  children,
  ...props
}: CoreCollapsibleRootProviderProps) {
  const machine = useMachine(collapsibleMachine, props)
  const api = createCollapsibleApi(machine, normalizeProps)

  return (
    <CollapsibleContextProvider value={api}>
      {children}
    </CollapsibleContextProvider>
  )
}

export interface CoreCollapsibleRootProps
  extends CollapsibleApiProps,
    Omit<ElementRenderProp<"div">, "dir"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function CoreCollapsibleRoot({
  children,
  ...props
}: CoreCollapsibleRootProps): ReactElement {
  const [collapsibleApiProps, localProps] = splitCollapsibleProps(props)

  const machine = useMachine(collapsibleMachine, collapsibleApiProps)
  const api = createCollapsibleApi(machine, normalizeProps)

  const mergedProps = mergeProps(api.getRootBindings(), localProps)

  return (
    <CollapsibleContextProvider value={api}>
      <PolymorphicElement as="div" {...mergedProps}>
        {children}
      </PolymorphicElement>
    </CollapsibleContextProvider>
  )
}

export interface CoreCollapsibleContentProps
  extends IdProp,
    ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function CoreCollapsibleContent({
  children,
  id,
  ...props
}: CoreCollapsibleContentProps): ReactElement {
  const context = useCollapsibleContext()

  const mergedProps = mergeProps(
    context.getContentBindings({
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

export interface CoreCollapsibleTriggerProps
  extends IdProp,
    ElementRenderProp<"button"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function CoreCollapsibleTrigger({
  children,
  id,
  ...props
}: CoreCollapsibleTriggerProps): ReactElement {
  const context = useCollapsibleContext()

  const mergedProps = mergeProps(
    context.getTriggerBindings({
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

export interface CoreCollapsibleContextProps {
  /**
   * {@link
   * https://react-next.qui.qualcomm.com/render-props#render-prop
   * Render Prop}
   *
   * @inheritDoc
   */
  children: RenderProp<CollapsibleApi>
}

export function CoreCollapsibleContext({
  children,
}: CoreCollapsibleContextProps): ReactNode {
  const context = useCollapsibleContext()
  return renderProp(children, context)
}
