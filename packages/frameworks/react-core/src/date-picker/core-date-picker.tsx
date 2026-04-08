// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ComponentPropsWithRef, ReactElement} from "react"

import {
  createDatePickerApi,
  type DatePickerApiProps,
  datePickerMachine,
  type DatePickerCellProps as CoreDatePickerCellProps,
  getCalendarDates,
  getDayOfMonth,
  getMonthName,
  getYear,
} from "@qualcomm-ui/core/date-picker"
import {
  type PresenceApiProps,
  splitPresenceProps,
} from "@qualcomm-ui/core/presence"
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
  DatePickerContextProvider,
  useDatePickerContext,
} from "./date-picker-context"

export interface CoreDatePickerRootProps
  extends DatePickerApiProps,
    PresenceApiProps,
    Omit<
      ElementRenderProp<"div">,
      "defaultValue" | "dir" | "onChange" | "value"
    > {}

export function CoreDatePickerRoot({
  children,
  ...props
}: CoreDatePickerRootProps): ReactElement {
  const [presenceProps, otherProps] = splitPresenceProps(props)
  const [datePickerProps, localProps] = splitDatePickerProps(otherProps)
  const config = useMachine(datePickerMachine, datePickerProps)
  const context = createDatePickerApi(config, normalizeProps)
  const presence = usePresence(
    mergeProps({present: context.open}, presenceProps),
  )

  const mergedProps = mergeProps(
    context.getRootBindings({id: useControlledId(datePickerProps.id)}),
    localProps,
  )

  return (
    <DatePickerContextProvider value={context}>
      <PresenceContextProvider value={presence}>
        <PolymorphicElement as="div" {...mergedProps}>
          {children}
        </PolymorphicElement>
      </PresenceContextProvider>
    </DatePickerContextProvider>
  )
}

export interface CoreDatePickerLabelProps
  extends ElementRenderProp<"label">,
    IdProp {}

export function CoreDatePickerLabel({
  children,
  id,
  ...props
}: CoreDatePickerLabelProps): ReactElement {
  const context = useDatePickerContext()
  const mergedProps = mergeProps(
    context.getLabelBindings({id: useControlledId(id)}),
    props,
  )

  return (
    <PolymorphicElement as="label" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}

export interface CoreDatePickerInputProps
  extends ComponentPropsWithRef<"input">,
    IdProp {}

export function CoreDatePickerInput({
  id,
  ...props
}: CoreDatePickerInputProps): ReactElement {
  const context = useDatePickerContext()
  const mergedProps = mergeProps(
    context.getInputBindings({id: useControlledId(id)}),
    props,
  )

  return <input {...mergedProps} />
}

export interface CoreDatePickerTriggerProps
  extends ComponentPropsWithRef<"button">,
    IdProp {}

export function CoreDatePickerTrigger({
  children,
  id,
  ...props
}: CoreDatePickerTriggerProps): ReactElement {
  const context = useDatePickerContext()
  const mergedProps = mergeProps(
    context.getTriggerBindings({id: useControlledId(id)}),
    props,
  )

  return <button {...mergedProps}>{children}</button>
}

export interface CoreDatePickerClearTriggerProps
  extends ComponentPropsWithRef<"button">,
    IdProp {}

export function CoreDatePickerClearTrigger({
  children,
  id,
  ...props
}: CoreDatePickerClearTriggerProps): ReactElement {
  const context = useDatePickerContext()
  const mergedProps = mergeProps(
    context.getClearTriggerBindings({id: useControlledId(id)}),
    props,
  )

  return <button {...mergedProps}>{children}</button>
}

export interface CoreDatePickerPositionerProps
  extends ElementRenderProp<"div">,
    IdProp {}

export function CoreDatePickerPositioner({
  children,
  id,
  ...props
}: CoreDatePickerPositionerProps): ReactElement | null {
  const context = useDatePickerContext()
  const presence = usePresenceContext()
  const controlledId = useControlledId(id)
  const onDestroy = useOnDestroyWhen(presence.unmounted)

  if (presence.unmounted) {
    return null
  }

  const mergedProps = mergeProps(
    context.getPositionerBindings({id: controlledId, onDestroy}),
    props,
  )

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}

export interface CoreDatePickerContentProps
  extends ElementRenderProp<"div">,
    IdProp {}

export function CoreDatePickerContent({
  children,
  id,
  ...props
}: CoreDatePickerContentProps): ReactElement {
  const context = useDatePickerContext()
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

export interface CoreDatePickerControlsProps
  extends ElementRenderProp<"div">,
    IdProp {}

export function CoreDatePickerControls({
  children,
  id,
  ...props
}: CoreDatePickerControlsProps): ReactElement {
  const context = useDatePickerContext()
  const mergedProps = mergeProps(
    context.getControlsBindings({id: useControlledId(id)}),
    props,
  )

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}

export interface CoreDatePickerPrevTriggerProps
  extends ComponentPropsWithRef<"button">,
    IdProp {}

export function CoreDatePickerPrevTrigger({
  children,
  id,
  ...props
}: CoreDatePickerPrevTriggerProps): ReactElement {
  const context = useDatePickerContext()
  const mergedProps = mergeProps(
    context.getPrevTriggerBindings({id: useControlledId(id)}),
    props,
  )

  return <button {...mergedProps}>{children}</button>
}

export interface CoreDatePickerNextTriggerProps
  extends ComponentPropsWithRef<"button">,
    IdProp {}

export function CoreDatePickerNextTrigger({
  children,
  id,
  ...props
}: CoreDatePickerNextTriggerProps): ReactElement {
  const context = useDatePickerContext()
  const mergedProps = mergeProps(
    context.getNextTriggerBindings({id: useControlledId(id)}),
    props,
  )

  return <button {...mergedProps}>{children}</button>
}

export interface CoreDatePickerViewTriggerProps
  extends ComponentPropsWithRef<"button">,
    IdProp {}

export function CoreDatePickerViewTrigger({
  children,
  id,
  ...props
}: CoreDatePickerViewTriggerProps): ReactElement {
  const context = useDatePickerContext()
  const focusedDate = context.focusedDate
  const view = context.view

  const monthName = getMonthName(focusedDate)
  const year = getYear(focusedDate)

  const mergedProps = mergeProps(
    context.getViewTriggerBindings({id: useControlledId(id)}),
    props,
  )

  return (
    <button {...mergedProps}>
      {children || `${monthName} ${year}`}
    </button>
  )
}

export interface CoreDatePickerCalendarProps
  extends ElementRenderProp<"table">,
    IdProp {}

export function CoreDatePickerCalendar({
  children,
  id,
  ...props
}: CoreDatePickerCalendarProps): ReactElement {
  const context = useDatePickerContext()
  const mergedProps = mergeProps(
    context.getCalendarBindings({id: useControlledId(id)}),
    props,
  )

  return (
    <PolymorphicElement as="table" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}

export interface CoreDatePickerCellProps
  extends CoreDatePickerCellProps,
    Omit<ElementRenderProp<"button">, "children"> {
  children?: (state: ReturnType<typeof useDatePickerContext>["getCellState"]) => ReactElement
}

export function CoreDatePickerCell({
  children,
  date,
  ...props
}: CoreDatePickerCellProps): ReactElement {
  const context = useDatePickerContext()
  const cellState = context.getCellState({date})
  const dayOfMonth = getDayOfMonth(date)

  const mergedProps = mergeProps(
    context.getCellBindings({date}),
    props,
  )

  return (
    <PolymorphicElement as="button" {...mergedProps}>
      {children ? children(cellState) : dayOfMonth}
    </PolymorphicElement>
  )
}

export interface CoreDatePickerTodayTriggerProps
  extends ComponentPropsWithRef<"button">,
    IdProp {}

export function CoreDatePickerTodayTrigger({
  children,
  id,
  ...props
}: CoreDatePickerTodayTriggerProps): ReactElement {
  const context = useDatePickerContext()
  const mergedProps = mergeProps(
    context.getTodayTriggerBindings({id: useControlledId(id)}),
    props,
  )

  return <button {...mergedProps}>{children || "Today"}</button>
}

function splitDatePickerProps<T extends DatePickerApiProps>(
  props: T,
): [DatePickerApiProps, Omit<T, keyof DatePickerApiProps>] {
  const {
    closeOnSelect,
    defaultFocusedDate,
    defaultOpen,
    defaultValue,
    dir,
    disabled,
    focusedDate,
    format,
    form,
    id,
    ids,
    invalid,
    locale,
    loopFocus,
    max,
    min,
    name,
    onFocusChange,
    onFocusOutside,
    onInteractOutside,
    onOpenChange,
    onPointerDownOutside,
    onValueChange,
    onViewChange,
    open,
    placeholder,
    positioning,
    readOnly,
    required,
    value,
    view,
    ...rest
  } = props

  return [
    {
      closeOnSelect,
      defaultFocusedDate,
      defaultOpen,
      defaultValue,
      dir,
      disabled,
      focusedDate,
      format,
      form,
      id,
      ids,
      invalid,
      locale,
      loopFocus,
      max,
      min,
      name,
      onFocusChange,
      onFocusOutside,
      onInteractOutside,
      onOpenChange,
      onPointerDownOutside,
      onValueChange,
      onViewChange,
      open,
      placeholder,
      positioning,
      readOnly,
      required,
      value,
      view,
    },
    rest as Omit<T, keyof DatePickerApiProps>,
  ]
}
