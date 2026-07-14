// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {
  createTourApi,
  type TourApi,
  type TourApiProps,
  type TourStepAction,
  tourMachine,
} from "@qualcomm-ui/core/tour"
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

import {TourContextProvider, useTourContext} from "./tour-context.js"

export interface CoreTourRootProps extends TourApiProps {
  children: ReactNode
}

export function CoreTourRoot({
  children,
  ...props
}: CoreTourRootProps): ReactElement {
  const api = createTourApi(useMachine(tourMachine, props), normalizeProps)

  return <TourContextProvider value={api}>{children}</TourContextProvider>
}

export interface CoreTourBackdropProps
  extends IdProp, ElementRenderProp<"div"> {}

export function CoreTourBackdrop({
  id,
  ...props
}: CoreTourBackdropProps): ReactElement {
  const context = useTourContext()
  const mergedProps = mergeProps(
    context.getBackdropBindings({
      id: useControlledId(id),
      onDestroy: useOnDestroy(),
    }),
    props,
  )

  return <PolymorphicElement as="div" {...mergedProps} />
}

export interface CoreTourSpotlightProps extends ElementRenderProp<"div"> {}

export function CoreTourSpotlight(props: CoreTourSpotlightProps): ReactElement {
  const context = useTourContext()
  const mergedProps = mergeProps(context.getSpotlightBindings(), props)

  return <PolymorphicElement as="div" {...mergedProps} />
}

export interface CoreTourPositionerProps
  extends IdProp, ElementRenderProp<"div"> {}

export function CoreTourPositioner({
  id,
  ...props
}: CoreTourPositionerProps): ReactElement {
  const context = useTourContext()
  const mergedProps = mergeProps(
    context.getPositionerBindings({
      id: useControlledId(id),
      onDestroy: useOnDestroy(),
    }),
    props,
  )

  return <PolymorphicElement as="div" {...mergedProps} />
}

export interface CoreTourContentProps
  extends IdProp, ElementRenderProp<"section"> {}

export function CoreTourContent({
  id,
  ...props
}: CoreTourContentProps): ReactElement {
  const context = useTourContext()
  const mergedProps = mergeProps(
    context.getContentBindings({
      id: useControlledId(id),
      onDestroy: useOnDestroy(),
    }),
    props,
  )

  return <PolymorphicElement as="section" {...mergedProps} />
}

export interface CoreTourArrowProps extends IdProp, ElementRenderProp<"div"> {}

export function CoreTourArrow({
  id,
  ...props
}: CoreTourArrowProps): ReactElement {
  const context = useTourContext()
  const mergedProps = mergeProps(
    context.getArrowBindings({
      id: useControlledId(id),
      onDestroy: useOnDestroy(),
    }),
    props,
  )

  return <PolymorphicElement as="div" {...mergedProps} />
}

export interface CoreTourArrowTipProps extends ElementRenderProp<"div"> {}

export function CoreTourArrowTip(props: CoreTourArrowTipProps): ReactElement {
  const context = useTourContext()
  const mergedProps = mergeProps(context.getArrowTipBindings(), props)

  return <PolymorphicElement as="div" {...mergedProps} />
}

export interface CoreTourHeadingProps extends IdProp, ElementRenderProp<"h2"> {}

export function CoreTourHeading({
  id,
  ...props
}: CoreTourHeadingProps): ReactElement {
  const context = useTourContext()
  const mergedProps = mergeProps(
    context.getHeadingBindings({
      id: useControlledId(id),
      onDestroy: useOnDestroy(),
    }),
    props,
  )

  return <PolymorphicElement as="h2" {...mergedProps} />
}

export interface CoreTourDescriptionProps
  extends IdProp, ElementRenderProp<"div"> {}

export function CoreTourDescription({
  id,
  ...props
}: CoreTourDescriptionProps): ReactElement {
  const context = useTourContext()
  const mergedProps = mergeProps(
    context.getDescriptionBindings({
      id: useControlledId(id),
      onDestroy: useOnDestroy(),
    }),
    props,
  )

  return <PolymorphicElement as="div" {...mergedProps} />
}

export interface CoreTourProgressTextProps extends ElementRenderProp<"div"> {}

export function CoreTourProgressText(
  props: CoreTourProgressTextProps,
): ReactElement {
  const context = useTourContext()
  const mergedProps = mergeProps(context.getProgressTextBindings(), props)

  return <PolymorphicElement as="div" {...mergedProps} />
}

export interface CoreTourActionTriggerProps {
  action: TourStepAction
  children: BindingRenderProp<ReturnType<TourApi["getActionTriggerBindings"]>>
}

export function CoreTourActionTrigger({
  action,
  children,
}: CoreTourActionTriggerProps): ReactElement {
  const context = useTourContext()

  return bindingRenderProp(children, context.getActionTriggerBindings(action))
}

export interface CoreTourCloseTriggerProps {
  children: BindingRenderProp<ReturnType<TourApi["getCloseTriggerBindings"]>>
}

export function CoreTourCloseTrigger({
  children,
}: CoreTourCloseTriggerProps): ReactElement {
  const context = useTourContext()

  return bindingRenderProp(children, context.getCloseTriggerBindings())
}

export interface CoreTourContextProps {
  children: RenderProp<TourApi>
}

export function CoreTourContext({children}: CoreTourContextProps): ReactNode {
  return renderProp(children, useTourContext())
}
