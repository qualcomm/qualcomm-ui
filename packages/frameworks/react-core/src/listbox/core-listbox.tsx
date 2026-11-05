// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ComponentPropsWithRef, ReactElement} from "react"

import {
  createListboxApi,
  type ListboxApiProps,
  type ListboxInputApiProps,
  type ListboxItemApiProps,
  type ListboxItemGroupApiProps,
  listboxMachine,
  splitListboxProps,
} from "@qualcomm-ui/core/listbox"
import {useOnDestroy} from "@qualcomm-ui/react-core/effects"
import {normalizeProps, useMachine} from "@qualcomm-ui/react-core/machine"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import {
  type ElementRenderProp,
  type IdProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import type {CollectionItem} from "@qualcomm-ui/utils/collection"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {ListboxContextProvider, useListboxContext} from "./listbox-context.js"
import {
  ListboxItemContextProvider,
  useListboxItemContext,
} from "./listbox-item-context.js"
import {
  ListboxItemGroupContextProvider,
  useListboxItemGroupContext,
} from "./listbox-item-group-context.js"

export interface CoreListboxRootProps<T extends CollectionItem = CollectionItem>
  extends
    ListboxApiProps<T>,
    IdProp,
    Omit<ElementRenderProp<"div">, "defaultValue" | "dir" | "onSelect"> {}

export function CoreListboxRoot<T extends CollectionItem = CollectionItem>({
  children,
  id,
  ...props
}: CoreListboxRootProps<T>): ReactElement {
  const [listboxProps, localProps] = splitListboxProps(props)
  const machine = useMachine(listboxMachine, listboxProps)
  const listboxApi = createListboxApi(machine, normalizeProps)

  const mergedProps = mergeProps(
    listboxApi.getRootBindings({id: useControlledId(id)}),
    localProps,
  )

  return (
    <ListboxContextProvider value={listboxApi}>
      <PolymorphicElement as="div" {...mergedProps}>
        {children}
      </PolymorphicElement>
    </ListboxContextProvider>
  )
}

export interface CoreListboxContentProps
  extends ElementRenderProp<"div">, IdProp {}

export function CoreListboxContent({
  children,
  id,
  ...props
}: CoreListboxContentProps): ReactElement {
  const listboxContext = useListboxContext()
  const mergedProps = mergeProps(
    listboxContext.getContentBindings({
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

export interface CoreListboxInputProps
  extends ComponentPropsWithRef<"input">, ListboxInputApiProps {}

export function CoreListboxInput({
  autoHighlight,
  keyboardPriority,
  ...props
}: CoreListboxInputProps): ReactElement {
  const listboxContext = useListboxContext()
  const mergedProps = mergeProps(
    listboxContext.getInputBindings({autoHighlight, keyboardPriority}),
    props,
  )

  return <input {...mergedProps} />
}

export interface CoreListboxItemProps<T extends CollectionItem = CollectionItem>
  extends ElementRenderProp<"div">, ListboxItemApiProps<T>, IdProp {}

export function CoreListboxItem<T extends CollectionItem = CollectionItem>({
  children,
  id,
  item,
  ...props
}: CoreListboxItemProps<T>): ReactElement {
  const listboxContext = useListboxContext()
  const itemProps: ListboxItemApiProps<T> = {item}
  const mergedProps = mergeProps(
    listboxContext.getItemBindings({
      ...itemProps,
      id: useControlledId(id),
      onDestroy: useOnDestroy(),
    }),
    props,
  )

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      <ListboxItemContextProvider value={itemProps}>
        {children}
      </ListboxItemContextProvider>
    </PolymorphicElement>
  )
}

export interface CoreListboxItemLabelProps extends ElementRenderProp<"span"> {}

export function CoreListboxItemLabel({
  children,
  ...props
}: CoreListboxItemLabelProps): ReactElement {
  const listboxContext = useListboxContext()
  const itemContext = useListboxItemContext()
  const mergedProps = mergeProps(
    listboxContext.getItemLabelBindings(itemContext),
    props,
  )

  return (
    <PolymorphicElement as="span" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}

export interface CoreListboxItemIndicatorProps extends ElementRenderProp<"span"> {}

export function CoreListboxItemIndicator({
  children,
  ...props
}: CoreListboxItemIndicatorProps): ReactElement {
  const listboxContext = useListboxContext()
  const itemContext = useListboxItemContext()
  const mergedProps = mergeProps(
    listboxContext.getItemIndicatorBindings(itemContext),
    props,
  )

  return (
    <PolymorphicElement as="span" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}

export interface CoreListboxItemGroupProps
  extends ElementRenderProp<"div">, IdProp {}

export function CoreListboxItemGroup({
  children,
  id: idProp,
  ...props
}: CoreListboxItemGroupProps): ReactElement {
  const listboxContext = useListboxContext()
  const id = useControlledId(idProp)
  const itemGroupProps: ListboxItemGroupApiProps = {id}
  const mergedProps = mergeProps(
    listboxContext.getItemGroupBindings({
      ...itemGroupProps,
      onDestroy: useOnDestroy(),
    }),
    props,
  )

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      <ListboxItemGroupContextProvider value={itemGroupProps}>
        {children}
      </ListboxItemGroupContextProvider>
    </PolymorphicElement>
  )
}

export interface CoreListboxItemGroupLabelProps
  extends ElementRenderProp<"div">, IdProp {}

export function CoreListboxItemGroupLabel({
  children,
  id,
  ...props
}: CoreListboxItemGroupLabelProps): ReactElement {
  const listboxContext = useListboxContext()
  const itemGroupContext = useListboxItemGroupContext()
  const mergedProps = mergeProps(
    listboxContext.getItemGroupLabelBindings({
      groupId: itemGroupContext.id,
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

export interface CoreListboxLabelProps
  extends ElementRenderProp<"div">, IdProp {}

export function CoreListboxLabel({
  children,
  id,
  ...props
}: CoreListboxLabelProps): ReactElement {
  const listboxContext = useListboxContext()
  const mergedProps = mergeProps(
    listboxContext.getLabelBindings({
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
