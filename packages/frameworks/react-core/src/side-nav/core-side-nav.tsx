// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {
  type RenderStrategyApiProps,
  splitRenderStrategyProps,
} from "@qualcomm-ui/core/presence"
import {
  createSideNavApi,
  type SideNavApi,
  type SideNavApiProps,
  sideNavMachine,
  splitSideNavProps,
} from "@qualcomm-ui/core/side-nav"
import type {TreeApiProps} from "@qualcomm-ui/core/tree"
import {useOnDestroy} from "@qualcomm-ui/react-core/effects"
import {normalizeProps, useMachine} from "@qualcomm-ui/react-core/machine"
import {RenderStrategyPropsProvider} from "@qualcomm-ui/react-core/presence"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import {
  type ElementRenderProp,
  type IdProp,
  PolymorphicElement,
  type RenderProp,
  renderProp,
} from "@qualcomm-ui/react-core/system"
import {CoreTree} from "@qualcomm-ui/react-core/tree"
import type {TreeNode} from "@qualcomm-ui/utils/collection"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {SideNavContextProvider, useSideNavContext} from "./side-nav-context"

export interface CoreSideNavRootProps<T = TreeNode>
  extends SideNavApiProps,
    Omit<
      TreeApiProps<T>,
      "checkedValue" | "defaultCheckedValue" | "onCheckedValueChange"
    >,
    RenderStrategyApiProps,
    IdProp,
    Omit<ElementRenderProp<"div">, "dir"> {}

export function CoreSideNavRoot<T = TreeNode>({
  children,
  id,
  ...props
}: CoreSideNavRootProps<T>): ReactElement {
  const [renderStrategyProps, localSideNavProps] =
    splitRenderStrategyProps(props)
  const [sideNavigationApiProps, localProps] =
    splitSideNavProps(localSideNavProps)

  const machine = useMachine(sideNavMachine, sideNavigationApiProps)
  const api = createSideNavApi(machine, normalizeProps)

  const mergedProps = mergeProps(
    api.getRootBindings({id: useControlledId(id)}),
    {
      shouldHideNode: (node) => {
        return !api.open && node.depth > 1
      },
    } satisfies {
      shouldHideNode: TreeApiProps<T>["shouldHideNode"]
    },
    localProps,
  )

  return (
    <RenderStrategyPropsProvider value={renderStrategyProps}>
      <SideNavContextProvider value={api}>
        <CoreTree.Root
          {...mergedProps}
          expandedValue={api.open ? mergedProps.expandedValue : []}
        >
          {children}
        </CoreTree.Root>
      </SideNavContextProvider>
    </RenderStrategyPropsProvider>
  )
}

export interface CoreSideNavTriggerProps
  extends IdProp,
    ElementRenderProp<"button"> {}

/**
 * The trigger that opens and closes the side navigation.
 */
export function CoreSideNavTrigger({
  children,
  id,
  ...props
}: CoreSideNavTriggerProps): ReactElement {
  const context = useSideNavContext()

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

export interface CoreSideNavContextProps {
  /**
   * {@link
   * https://react-next.qui.qualcomm.com/render-props#render-prop
   * Render Prop}
   *
   * @inheritDoc
   */
  children: RenderProp<SideNavApi>
}

export function CoreSideNavContext({
  children,
}: CoreSideNavContextProps): ReactNode {
  const context = useSideNavContext()
  return renderProp(children, context)
}

export interface CoreSideNavHeaderProps extends ElementRenderProp<"div"> {}

export function CoreSideNavHeader(props: CoreSideNavHeaderProps): ReactElement {
  const sideNavContext = useSideNavContext()
  const mergedProps = mergeProps(sideNavContext.getHeaderBindings(), props)

  return <PolymorphicElement as="div" {...mergedProps} />
}

export interface CoreSideNavHeaderLogoProps extends ElementRenderProp<"div"> {}

export function CoreSideNavHeaderLogo({
  ...props
}: CoreSideNavHeaderLogoProps): ReactElement {
  const sideNavContext = useSideNavContext()
  const mergedProps = mergeProps(sideNavContext.getHeaderLogoBindings(), props)

  return <PolymorphicElement as="div" {...mergedProps} />
}

export interface CoreSideNavHeaderTitleProps extends ElementRenderProp<"div"> {}

export function CoreSideNavHeaderTitle({
  ...props
}: CoreSideNavHeaderTitleProps): ReactElement {
  const sideNavContext = useSideNavContext()
  const mergedProps = mergeProps(sideNavContext.getHeaderTitleBindings(), props)

  return <PolymorphicElement as="div" {...mergedProps} />
}

export interface CoreSideNavHeaderActionProps
  extends ElementRenderProp<"button"> {}

export function CoreSideNavHeaderAction({
  ...props
}: CoreSideNavHeaderActionProps): ReactElement {
  const sideNavContext = useSideNavContext()
  const mergedProps = mergeProps(
    sideNavContext.getHeaderActionBindings(),
    props,
  )

  return <PolymorphicElement as="button" {...mergedProps} />
}
