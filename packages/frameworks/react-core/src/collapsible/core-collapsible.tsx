// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, type ReactNode, useState} from "react"

import {
  type CollapsibleApi,
  type CollapsibleApiProps,
  collapsibleMachine,
  createCollapsibleApi,
  splitCollapsibleProps,
} from "@qualcomm-ui/core/collapsible"
import {
  type RenderStrategyApiProps,
  splitRenderStrategyProps,
} from "@qualcomm-ui/core/presence"
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
  type CollapsibleContextValue,
  useCollapsibleContext,
} from "./collapsible-context.js"

function useCollapsible({
  lazyMount,
  unmountOnExit,
  ...props
}: CollapsibleApiProps & RenderStrategyApiProps): CollapsibleContextValue {
  const machine = useMachine(collapsibleMachine, props)
  const api = createCollapsibleApi(machine, normalizeProps)
  const [wasVisible, setWasVisible] = useState(api.visible)

  if (api.visible && !wasVisible) {
    setWasVisible(true)
  }

  return {
    ...api,
    isUnmounted:
      !api.visible &&
      ((!wasVisible && !!lazyMount) || (wasVisible && !!unmountOnExit)),
  }
}

export interface CoreCollapsibleRootProviderProps
  extends CollapsibleApiProps, RenderStrategyApiProps {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function CoreCollapsibleRootProvider({
  children,
  ...props
}: CoreCollapsibleRootProviderProps) {
  const api = useCollapsible(props)

  return (
    <CollapsibleContextProvider value={api}>
      {children}
    </CollapsibleContextProvider>
  )
}

export interface CoreCollapsibleRootProps
  extends
    CollapsibleApiProps,
    RenderStrategyApiProps,
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
  const [renderStrategyProps, localRootProps] = splitRenderStrategyProps(props)
  const [collapsibleApiProps, localProps] =
    splitCollapsibleProps(localRootProps)
  const api = useCollapsible({...collapsibleApiProps, ...renderStrategyProps})

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
  extends IdProp, ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function CoreCollapsibleContent({
  children,
  id,
  ...props
}: CoreCollapsibleContentProps): ReactElement | null {
  const context = useCollapsibleContext()

  const mergedProps = mergeProps(
    context.getContentBindings({
      id: useControlledId(id),
      onDestroy: useOnDestroy(),
    }),
    props,
  )

  if (context.isUnmounted) {
    return null
  }

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}

export interface CoreCollapsibleTriggerProps
  extends IdProp, ElementRenderProp<"button"> {
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
   * https://react.qui.qualcomm.com/render-props#render-prop
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
