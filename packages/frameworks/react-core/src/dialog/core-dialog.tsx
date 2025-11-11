// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {
  createDialogApi,
  type DialogApiProps,
  type DialogCloseTriggerBindings,
  dialogMachine,
  type DialogTriggerBindings,
} from "@qualcomm-ui/core/dialog"
import {
  type PresenceApiProps,
  splitPresenceProps,
  splitRenderStrategyProps,
} from "@qualcomm-ui/core/presence"
import {useOnDestroy, useOnDestroyWhen} from "@qualcomm-ui/react-core/effects"
import {normalizeProps, useMachine} from "@qualcomm-ui/react-core/machine"
import {
  PresenceContextProvider,
  RenderStrategyPropsProvider,
  usePresence,
  usePresenceContext,
  useRenderStrategyPropsContext,
} from "@qualcomm-ui/react-core/presence"
import {composeRefs} from "@qualcomm-ui/react-core/refs"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import {
  type BindingRenderProp,
  bindingRenderProp,
  type ElementRenderProp,
  type IdProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {DialogContextProvider, useDialogContext} from "./dialog-context"

export interface CoreDialogRootProps extends DialogApiProps, PresenceApiProps {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children: ReactNode
}

export function CoreDialogRoot(props: CoreDialogRootProps): ReactElement {
  const [presenceProps, {children, ...localProps}] = splitPresenceProps(props)
  const [renderStrategyProps] = splitRenderStrategyProps(presenceProps)
  const machine = useMachine(dialogMachine, localProps)
  const dialogApi = createDialogApi(machine, normalizeProps)
  const presenceApi = usePresence(
    mergeProps({present: dialogApi.open}, presenceProps),
  )
  return (
    <DialogContextProvider value={dialogApi}>
      <PresenceContextProvider value={presenceApi}>
        <RenderStrategyPropsProvider value={renderStrategyProps}>
          {children}
        </RenderStrategyPropsProvider>
      </PresenceContextProvider>
    </DialogContextProvider>
  )
}

export interface CoreDialogContentProps
  extends IdProp,
    ElementRenderProp<"section"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function CoreDialogContent({
  children,
  id: idProp,
  ref,
  ...props
}: CoreDialogContentProps): ReactNode {
  const dialogContext = useDialogContext()
  const presence = usePresenceContext()
  const onDestroy = useOnDestroyWhen(presence.unmounted)
  const id = useControlledId(idProp)

  if (presence.unmounted) {
    return null
  }

  // TODO: validate accessibility
  const mergedProps = mergeProps(
    dialogContext.getContentBindings({id, onDestroy}),
    presence.getPresenceBindings(),
    props,
  )

  return (
    <PolymorphicElement
      as="section"
      {...mergedProps}
      ref={composeRefs(presence.ref, ref)}
    >
      {children}
    </PolymorphicElement>
  )
}

export interface CoreDialogCloseTriggerProps extends IdProp {
  /**
   * {@link https://react-next.qui.qualcomm.com/render-props#binding-render-prop Render Prop}
   * that provides or binds the event handlers and attributes to the child element.
   *
   * @inheritDoc
   */
  children: BindingRenderProp<DialogCloseTriggerBindings>
}

export function CoreDialogCloseTrigger({
  children,
  id,
}: CoreDialogCloseTriggerProps): ReactElement {
  const context = useDialogContext()

  return bindingRenderProp(
    children,
    context.getCloseTriggerBindings({
      id: useControlledId(id),
      onDestroy: useOnDestroy(),
    }),
  )
}

export interface CoreDialogBackdropProps
  extends IdProp,
    ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function CoreDialogBackdrop({
  children,
  id: idProp,
  ...props
}: CoreDialogBackdropProps): ReactNode {
  const dialogContext = useDialogContext()
  const renderStrategyProps = useRenderStrategyPropsContext()
  const presence = usePresence({
    ...renderStrategyProps,
    present: dialogContext.open,
  })
  const onDestroy = useOnDestroyWhen(presence.unmounted)
  const id = useControlledId(idProp)

  if (presence.unmounted) {
    return null
  }

  const mergedProps = mergeProps(
    dialogContext.getBackdropBindings({id, onDestroy}),
    presence.getPresenceBindings(),
    props,
  )

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}

export interface CoreDialogBodyProps extends ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function CoreDialogBody({
  children,
  ...props
}: CoreDialogBodyProps): ReactElement {
  const dialogContext = useDialogContext()

  const mergedProps = mergeProps(dialogContext.getBodyBindings(), props)

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}

export interface CoreDialogFooterProps extends ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function CoreDialogFooter(props: CoreDialogFooterProps): ReactElement {
  const dialogContext = useDialogContext()
  const mergedProps = mergeProps(dialogContext.getFooterBindings(), props)

  return <PolymorphicElement as="div" {...mergedProps} />
}

export interface CoreDialogHeadingProps
  extends IdProp,
    ElementRenderProp<"h2"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function CoreDialogHeading({
  children,
  id,
  ...props
}: CoreDialogHeadingProps): ReactElement {
  const dialogContext = useDialogContext()

  const mergedProps = mergeProps(
    dialogContext.getHeadingBindings({
      id: useControlledId(id),
      onDestroy: useOnDestroy(),
    }),
    props,
  )

  return (
    <PolymorphicElement as="h2" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}

export interface CoreDialogPositionerProps
  extends IdProp,
    ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function CoreDialogPositioner({
  children,
  id: idProp,
  ...props
}: CoreDialogPositionerProps): ReactNode {
  const dialogContext = useDialogContext()
  const presence = usePresenceContext()
  const id = useControlledId(idProp)
  const onDestroy = useOnDestroy()

  if (presence.unmounted) {
    return null
  }

  const mergedProps = mergeProps(
    dialogContext.getPositionerBindings({id, onDestroy}),
    props,
  )

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}

export interface CoreDialogTriggerProps extends IdProp {
  /**
   * {@link https://react-next.qui.qualcomm.com/render-props#binding-render-prop Render Prop}
   * used to wire up the dialog open behavior.
   *
   * @inheritDoc
   */
  children: BindingRenderProp<DialogTriggerBindings>
}

export function CoreDialogTrigger({
  children,
  id,
}: CoreDialogTriggerProps): ReactElement {
  const dialogContext = useDialogContext()
  return bindingRenderProp(
    children,
    dialogContext.getTriggerBindings({
      id: useControlledId(id),
      onDestroy: useOnDestroy(),
    }),
  )
}

export interface CoreDialogDescriptionProps
  extends IdProp,
    ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function CoreDialogDescription({
  children,
  id,
  ...props
}: CoreDialogDescriptionProps): ReactElement {
  const dialogContext = useDialogContext()
  const mergedProps = mergeProps(
    dialogContext.getDescriptionBindings({
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
