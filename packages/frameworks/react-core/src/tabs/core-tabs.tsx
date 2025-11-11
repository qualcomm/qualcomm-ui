// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {
  type RenderStrategyApiProps,
  splitRenderStrategyProps,
} from "@qualcomm-ui/core/presence"
import {
  createTabsApi,
  type PanelProps,
  splitTabsProps,
  type TabProps,
  type TabsApi,
  type TabsApiProps,
  tabsMachine,
} from "@qualcomm-ui/core/tabs"
import {useOnDestroy, useOnDestroyWhen} from "@qualcomm-ui/react-core/effects"
import {normalizeProps, useMachine} from "@qualcomm-ui/react-core/machine"
import {
  PresenceContextProvider,
  RenderStrategyPropsProvider,
  usePresence,
  useRenderStrategyPropsContext,
} from "@qualcomm-ui/react-core/presence"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import {
  type ElementRenderProp,
  type IdProp,
  PolymorphicElement,
  type RenderProp,
  renderProp,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {TabPropsContextProvider, useTabPropsContext} from "./tab-prop-context"
import {TabsContextProvider, useTabsContext} from "./tabs-context"

export interface CoreTabsRootProps
  extends TabsApiProps,
    RenderStrategyApiProps,
    Omit<ElementRenderProp<"div">, "defaultValue" | "dir"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function CoreTabsRoot({
  children,
  ...props
}: CoreTabsRootProps): ReactElement {
  const [renderStrategyProps, localTabsProps] = splitRenderStrategyProps(props)
  const [tabsProps, localProps] = splitTabsProps(localTabsProps)
  const machine = useMachine(tabsMachine, tabsProps)
  const tabsApi = createTabsApi(machine, normalizeProps)
  const mergedProps = mergeProps(tabsApi.getRootBindings(), localProps)

  return (
    <TabsContextProvider value={tabsApi}>
      <RenderStrategyPropsProvider value={renderStrategyProps}>
        <PolymorphicElement as="div" {...mergedProps}>
          {children}
        </PolymorphicElement>
      </RenderStrategyPropsProvider>
    </TabsContextProvider>
  )
}

export interface CoreTabsListProps extends IdProp, ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function CoreTabsList({
  children,
  id,
  ...props
}: CoreTabsListProps): ReactElement {
  const tabsContext = useTabsContext()
  const mergedProps = mergeProps(
    tabsContext.getListBindings({
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

export interface CoreTabsTabButtonProps
  extends IdProp,
    ElementRenderProp<"button"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function CoreTabsTabButton({
  children,
  id,
  ...props
}: CoreTabsTabButtonProps): ReactElement {
  const tabsContext = useTabsContext()
  const tabProps = useTabPropsContext()
  const mergedProps = mergeProps(
    tabsContext.getTabButtonBindings({
      ...tabProps,
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

export interface CoreTabsPanelProps
  extends PanelProps,
    IdProp,
    ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function CoreTabsPanel({
  children,
  id,
  ...props
}: CoreTabsPanelProps): ReactElement {
  const renderStrategyProps = useRenderStrategyPropsContext()
  const tabsContext = useTabsContext()

  const presence = usePresence({
    ...renderStrategyProps,
    immediate: true,
    present: tabsContext.value === props.value,
  })

  const mergedProps = mergeProps(
    tabsContext.getPanelBindings({
      ...props,
      id: useControlledId(id),
      onDestroy: useOnDestroyWhen(presence.unmounted),
    }),
    presence.getPresenceBindings(),
    props,
  )

  return (
    <PresenceContextProvider value={presence}>
      {presence.unmounted ? null : (
        <PolymorphicElement as="div" {...mergedProps}>
          {children}
        </PolymorphicElement>
      )}
    </PresenceContextProvider>
  )
}

export interface CoreTabsTabDismissButtonProps
  extends ElementRenderProp<"button"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function CoreTabsTabDismissButton({
  children,
  ...props
}: CoreTabsTabDismissButtonProps): ReactElement {
  const tabsContext = useTabsContext()
  const mergedProps = mergeProps(
    tabsContext.getTabDismissButtonBindings(),
    props,
  )

  return (
    <PolymorphicElement as="button" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}

export interface CoreTabsTabProps extends TabProps, ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function CoreTabsTab({
  children,
  ...props
}: CoreTabsTabProps): ReactElement {
  const tabsContext = useTabsContext()
  const {disabled, value}: TabProps = props
  const mergedProps = mergeProps(tabsContext.getTabBindings(), props)

  return (
    <TabPropsContextProvider value={{disabled, value}}>
      <PolymorphicElement as="div" {...mergedProps}>
        {children}
      </PolymorphicElement>
    </TabPropsContextProvider>
  )
}

export interface CoreTabsIndicatorProps
  extends IdProp,
    ElementRenderProp<"div"> {}

export function CoreTabsIndicator({
  children,
  id,
  ...props
}: CoreTabsIndicatorProps): ReactElement {
  const tabsContext = useTabsContext()
  const mergedProps = mergeProps(
    tabsContext.getIndicatorBindings({
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

export interface CoreTabsContextProps {
  /**
   * {@link https://react-next.qui.qualcomm.com/render-props Render Prop}
   * that provides the current {@link TabsApi} context.
   *
   * @inheritDoc
   */
  children: RenderProp<TabsApi>
}

export function CoreTabsContext({children}: CoreTabsContextProps): ReactNode {
  const context = useTabsContext()
  return renderProp(children, context)
}
