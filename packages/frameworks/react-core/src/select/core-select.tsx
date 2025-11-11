// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ComponentPropsWithRef, ReactElement} from "react"

import {type PresenceApiProps, splitPresenceProps} from "@qualcomm-ui/core/presence"
import {
  createSelectApi,
  type ItemProps,
  type SelectApiProps,
  selectMachine,
  splitSelectProps,
} from "@qualcomm-ui/core/select"
import {useOnDestroy, useOnDestroyWhen} from "@qualcomm-ui/react-core/effects"
import {normalizeProps, useMachine} from "@qualcomm-ui/react-core/machine"
import {
  PresenceContextProvider,
  usePresence,
  usePresenceContext,
} from "@qualcomm-ui/react-core/presence"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import {
  type ElementRenderProp,
  type IdProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {
  SelectContextProvider,
  SelectItemContextProvider,
  useSelectContext,
  useSelectItemContext,
} from "./select-context"

export interface CoreSelectRootProps
  extends SelectApiProps,
    PresenceApiProps,
    Omit<ElementRenderProp<"div">, "defaultValue" | "dir" | "onSelect"> {}

export function CoreSelectRoot({
  children,
  ...props
}: CoreSelectRootProps): ReactElement {
  const [presenceProps, otherProps] = splitPresenceProps(props)
  const [selectProps, localProps] = splitSelectProps<SelectApiProps>(otherProps)
  const config = useMachine(selectMachine, selectProps)
  const context = createSelectApi(config, normalizeProps)
  const presence = usePresence(
    mergeProps({present: context.open}, presenceProps),
  )

  const mergedProps = mergeProps(
    context.getRootBindings({id: useControlledId(selectProps.id)}),
    localProps,
  )

  return (
    <SelectContextProvider value={context}>
      <PresenceContextProvider value={presence}>
        <PolymorphicElement as="div" {...mergedProps}>
          {children}
        </PolymorphicElement>
      </PresenceContextProvider>
    </SelectContextProvider>
  )
}

export interface CoreSelectContentProps
  extends ElementRenderProp<"div">,
    IdProp {}

export function CoreSelectContent({
  children,
  id,
  ...props
}: CoreSelectContentProps): ReactElement {
  const selectContext = useSelectContext()
  const mergedProps = mergeProps(
    selectContext.getContentBindings({
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

export interface CoreSelectHiddenSelectProps
  extends ComponentPropsWithRef<"select">,
    IdProp {}

export function CoreSelectHiddenSelect({
  id,
  ...props
}: CoreSelectHiddenSelectProps): ReactElement {
  const selectContext = useSelectContext()
  const empty = selectContext.empty
  const options = selectContext.hiddenSelectOptions
  const mergedProps = mergeProps(
    selectContext.getHiddenSelectBindings({
      id: useControlledId(id),
      onDestroy: useOnDestroy(),
    }),
    props,
  )

  return (
    <select {...mergedProps}>
      {empty && <option value="" />}
      {options.map((opt) => (
        <option key={opt.value} disabled={opt.disabled} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}

export interface CoreSelectPositionerProps
  extends ElementRenderProp<"div">,
    IdProp {}

export function CoreSelectPositioner({
  children,
  id,
  ...props
}: CoreSelectPositionerProps): ReactElement | null {
  const selectContext = useSelectContext()
  const presence = usePresenceContext()
  const controlledId = useControlledId(id)
  const onDestroy = useOnDestroyWhen(presence.unmounted)

  if (presence.unmounted) {
    return null
  }

  const mergedProps = mergeProps(
    selectContext.getPositionerBindings({id: controlledId, onDestroy}),
    props,
  )

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}

export interface CoreSelectControlProps
  extends ElementRenderProp<"div">,
    IdProp {}

export function CoreSelectControl({
  children,
  id,
  ...props
}: CoreSelectControlProps): ReactElement {
  const selectContext = useSelectContext()
  const mergedProps = mergeProps(
    selectContext.getControlBindings({
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

export interface CoreSelectItemProps
  extends ElementRenderProp<"div">,
    ItemProps {}

export function CoreSelectItem({
  children,
  ...props
}: CoreSelectItemProps): ReactElement {
  const selectContext = useSelectContext()
  const itemContext = selectContext.getItemState(props)
  const mergedProps = mergeProps(
    selectContext.getItemBindings(itemContext),
    props,
  )

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      <SelectItemContextProvider value={itemContext}>
        {children}
      </SelectItemContextProvider>
    </PolymorphicElement>
  )
}

export interface CoreSelectItemTextProps extends ElementRenderProp<"span"> {}

export function CoreSelectItemText({
  children,
  ...props
}: CoreSelectItemTextProps): ReactElement {
  const selectContext = useSelectContext()
  const context = useSelectItemContext()
  const mergedProps = mergeProps(
    selectContext.getItemTextBindings(context),
    props,
  )

  return (
    <PolymorphicElement as="span" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}

export interface CoreSelectItemIndicatorProps
  extends ElementRenderProp<"span"> {}

/*
 * Note that Zag/Ark call this part the "Trigger"
 */
export function CoreSelectItemIndicator({
  children,
  ...props
}: CoreSelectItemIndicatorProps): ReactElement {
  const selectContext = useSelectContext()
  const context = useSelectItemContext()
  const mergedProps = mergeProps(
    selectContext.getItemIndicatorBindings(context),
    props,
  )

  return (
    <PolymorphicElement as="span" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
