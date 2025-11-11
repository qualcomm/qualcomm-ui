// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ComponentPropsWithRef, ReactElement} from "react"

import {
  type ComboboxApiItemGroupProps,
  type ComboboxApiItemProps,
  type ComboboxApiProps,
  type ComboboxApiTriggerProps,
  comboboxMachine,
  createComboboxApi,
  splitComboboxProps,
} from "@qualcomm-ui/core/combobox"
import {type PresenceApiProps, splitPresenceProps} from "@qualcomm-ui/core/presence"
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
import type {CollectionItem} from "@qualcomm-ui/utils/collection"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {ComboboxContextProvider, useComboboxContext} from "./combobox-context"
import {
  ComboboxItemContextProvider,
  useComboboxItemContext,
} from "./combobox-item-context"
import {
  ComboboxItemGroupContextProvider,
  useComboboxItemGroupContext,
} from "./combobox-item-group-context"

export interface CoreComboboxRootProps<T extends CollectionItem>
  extends ComboboxApiProps<T>,
    PresenceApiProps,
    IdProp,
    Omit<ElementRenderProp<"div">, "defaultValue" | "dir" | "onSelect"> {}

export function CoreComboboxRoot<T extends CollectionItem = CollectionItem>({
  children,
  id,
  ...props
}: CoreComboboxRootProps<T>): ReactElement {
  const [presenceProps, comboboxProps] = splitPresenceProps(props)
  const [comboboxMachineProps, localProps] = splitComboboxProps(comboboxProps)

  const machine = useMachine(comboboxMachine, comboboxMachineProps)
  const comboboxApi = createComboboxApi(machine, normalizeProps)

  const presence = usePresence(
    mergeProps({present: comboboxApi.open}, presenceProps),
  )

  const mergedProps = mergeProps(
    comboboxApi.getRootBindings({id: useControlledId(id)}),
    localProps,
  )

  return (
    <PresenceContextProvider value={presence}>
      <ComboboxContextProvider value={comboboxApi}>
        <PolymorphicElement as="div" {...mergedProps}>
          {children}
        </PolymorphicElement>
      </ComboboxContextProvider>
    </PresenceContextProvider>
  )
}

export interface CoreComboboxClearTriggerProps
  extends ElementRenderProp<"button">,
    IdProp {}

export function CoreComboboxClearTrigger({
  id,
  ...props
}: CoreComboboxClearTriggerProps): ReactElement {
  const comboboxContext = useComboboxContext()
  const mergedProps = mergeProps(
    comboboxContext.getClearTriggerBindings({
      id: useControlledId(id),
      onDestroy: useOnDestroy(),
    }),
    props,
  )

  return <PolymorphicElement as="button" {...mergedProps} />
}

export interface CoreComboboxContentProps
  extends ElementRenderProp<"div">,
    IdProp {}

export function CoreComboboxContent({
  id,
  ...props
}: CoreComboboxContentProps): ReactElement | null {
  const comboboxContext = useComboboxContext()
  const presence = usePresenceContext()
  const mergedProps = mergeProps(
    comboboxContext.getContentBindings({
      id: useControlledId(id),
      onDestroy: useOnDestroyWhen(presence.unmounted),
    }),
    presence.getPresenceBindings(),
    props,
  )

  if (presence.unmounted) {
    return null
  }

  return <PolymorphicElement as="div" {...mergedProps} />
}

export interface CoreComboboxControlProps
  extends ElementRenderProp<"div">,
    IdProp {}

export function CoreComboboxControl({
  id,
  ...props
}: CoreComboboxControlProps): ReactElement {
  const comboboxContext = useComboboxContext()
  const mergedProps = mergeProps(
    comboboxContext.getControlBindings({
      id: useControlledId(id),
      onDestroy: useOnDestroy(),
    }),
    props,
  )

  return <PolymorphicElement as="div" {...mergedProps} />
}

export interface CoreComboboxEmptyProps extends ElementRenderProp<"div"> {}

export function CoreComboboxEmpty(
  props: CoreComboboxEmptyProps,
): ReactElement | null {
  const comboboxContext = useComboboxContext()

  if (comboboxContext.collection.size > 0) {
    return null
  }

  const mergedProps = mergeProps(comboboxContext.getEmptyBindings(), props)

  return <PolymorphicElement as="div" {...mergedProps} />
}

export interface CoreComboboxInputProps
  extends ComponentPropsWithRef<"input">,
    IdProp {}

export function CoreComboboxInput({
  id,
  ...props
}: CoreComboboxInputProps): ReactElement {
  const comboboxContext = useComboboxContext()
  const mergedProps = mergeProps(
    comboboxContext.getInputBindings({
      id: useControlledId(id),
      onDestroy: useOnDestroy(),
    }),
    props,
  )

  return <input {...mergedProps} />
}

export interface CoreComboboxItemProps<T extends CollectionItem>
  extends ElementRenderProp<"div">,
    ComboboxApiItemProps<T> {}

export function CoreComboboxItem<T extends CollectionItem = CollectionItem>({
  item,
  persistFocus,
  ...props
}: CoreComboboxItemProps<T>): ReactElement {
  const comboboxContext = useComboboxContext()
  const itemProps: ComboboxApiItemProps<T> = {item, persistFocus}
  const itemContext = comboboxContext.getItemState(itemProps)
  const mergedProps = mergeProps(
    comboboxContext.getItemBindings(itemContext),
    props,
  )

  return (
    <ComboboxItemContextProvider value={itemContext}>
      <PolymorphicElement as="div" {...mergedProps} />
    </ComboboxItemContextProvider>
  )
}

export interface CoreComboboxItemTextProps extends ElementRenderProp<"span"> {}

export function CoreComboboxItemText(
  props: CoreComboboxItemTextProps,
): ReactElement {
  const comboboxContext = useComboboxContext()
  const itemContext = useComboboxItemContext()
  const mergedProps = mergeProps(
    comboboxContext.getItemTextBindings(itemContext),
    props,
  )

  return <PolymorphicElement as="span" {...mergedProps} />
}

export interface CoreComboboxItemIndicatorProps
  extends ElementRenderProp<"span"> {}

export function CoreComboboxItemIndicator({
  ...props
}: CoreComboboxItemIndicatorProps): ReactElement {
  const comboboxContext = useComboboxContext()
  const itemContext = useComboboxItemContext()
  const mergedProps = mergeProps(
    comboboxContext.getItemIndicatorBindings(itemContext),
    props,
  )

  return <PolymorphicElement as="span" {...mergedProps} />
}

export interface CoreComboboxItemGroupProps extends ElementRenderProp<"div"> {
  /**
   * Unique identifier for the combobox item group. Not the final HTML `id`
   * attribute.
   */
  id?: string
}

export function CoreComboboxItemGroup({
  id: idProp,
  ...props
}: CoreComboboxItemGroupProps): ReactElement {
  const comboboxContext = useComboboxContext()
  const id = useControlledId(idProp)
  const itemGroupProps: ComboboxApiItemGroupProps = {id}
  const mergedProps = mergeProps(
    comboboxContext.getItemGroupBindings(itemGroupProps),
    props,
  )

  return (
    <ComboboxItemGroupContextProvider value={itemGroupProps}>
      <PolymorphicElement as="div" {...mergedProps} />
    </ComboboxItemGroupContextProvider>
  )
}

export interface CoreComboboxItemGroupLabelProps
  extends ElementRenderProp<"div"> {}

export function CoreComboboxItemGroupLabel({
  ...props
}: CoreComboboxItemGroupLabelProps): ReactElement {
  const comboboxContext = useComboboxContext()
  const itemGroupProps = useComboboxItemGroupContext()
  const mergedProps = mergeProps(
    comboboxContext.getItemGroupLabelBindings({htmlFor: itemGroupProps.id}),
    props,
  )

  return <PolymorphicElement as="div" {...mergedProps} />
}

export interface CoreComboboxLabelProps
  extends ElementRenderProp<"label">,
    IdProp {}

export function CoreComboboxLabel({
  id,
  ...props
}: CoreComboboxLabelProps): ReactElement {
  const comboboxContext = useComboboxContext()
  const mergedProps = mergeProps(
    comboboxContext.getLabelBindings({
      id: useControlledId(id),
      onDestroy: useOnDestroy(),
    }),
    props,
  )

  return <PolymorphicElement as="label" {...mergedProps} />
}

export interface CoreComboboxPositionerProps
  extends ElementRenderProp<"div">,
    IdProp {}

export function CoreComboboxPositioner({
  id,
  ...props
}: CoreComboboxPositionerProps): ReactElement | null {
  const comboboxContext = useComboboxContext()
  const presence = usePresenceContext()
  const mergedProps = mergeProps(
    comboboxContext.getPositionerBindings({
      id: useControlledId(id),
      onDestroy: useOnDestroyWhen(presence.unmounted),
    }),
    props,
  )

  if (presence.unmounted) {
    return null
  }

  return <PolymorphicElement as="div" {...mergedProps} />
}

export interface CoreComboboxTriggerProps
  extends ElementRenderProp<"button">,
    ComboboxApiTriggerProps,
    IdProp {}

export function CoreComboboxTrigger({
  focusable,
  id,
  ...props
}: CoreComboboxTriggerProps): ReactElement {
  const comboboxContext = useComboboxContext()
  const mergedProps = mergeProps(
    comboboxContext.getTriggerBindings({
      focusable,
      id: useControlledId(id),
      onDestroy: useOnDestroy(),
    }),
    props,
  )

  return <PolymorphicElement as="button" {...mergedProps} />
}

export interface CoreComboboxHintProps
  extends ElementRenderProp<"div">,
    IdProp {}

export function CoreComboboxHint({
  id,
  ...props
}: CoreComboboxHintProps): ReactElement {
  const comboboxContext = useComboboxContext()
  const mergedProps = mergeProps(
    comboboxContext.getHintBindings({
      id: useControlledId(id),
      onDestroy: useOnDestroy(),
    }),
    props,
  )

  return <PolymorphicElement as="div" {...mergedProps} />
}

export interface CoreComboboxErrorTextProps
  extends ElementRenderProp<"div">,
    IdProp {}

export function CoreComboboxErrorText({
  id,
  ...props
}: CoreComboboxErrorTextProps): ReactElement {
  const comboboxContext = useComboboxContext()
  const mergedProps = mergeProps(
    comboboxContext.getErrorTextBindings({
      id: useControlledId(id),
      onDestroy: useOnDestroy(),
    }),
    props,
  )

  return <PolymorphicElement as="div" {...mergedProps} />
}

export interface CoreComboboxErrorIndicatorProps
  extends ElementRenderProp<"span"> {}

export function CoreComboboxErrorIndicator({
  ...props
}: CoreComboboxErrorIndicatorProps): ReactElement {
  const comboboxContext = useComboboxContext()
  const mergedProps = mergeProps(
    comboboxContext.getErrorIndicatorBindings(),
    props,
  )

  return <PolymorphicElement as="span" {...mergedProps} />
}
