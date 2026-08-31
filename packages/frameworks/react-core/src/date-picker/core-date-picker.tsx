// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {
  createDatePickerApi,
  type DatePickerApi,
  type DatePickerApiProps,
  datePickerMachine,
  type DateValue,
  type DatePickerDateView,
  type DatePickerApiDayTableCellProps,
  type DatePickerApiInputProps,
  type DatePickerApiLabelProps,
  type DatePickerApiPresetTriggerProps,
  splitDatePickerInputProps,
  splitDatePickerLabelProps,
  splitDatePickerPresetTriggerProps,
  splitDatePickerProps,
  type DatePickerApiTableCellProps,
  type DatePickerApiTableProps,
  type DatePickerApiViewProps,
  type DatePickerVisibleRange,
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
  type RenderProp,
  renderProp,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {
  DatePickerContextProvider,
  DatePickerTableCellContextProvider,
  DatePickerTableContextProvider,
  DatePickerViewContextProvider,
  useDatePickerContext,
  useDatePickerTableCellContext,
  useDatePickerTableContext,
  useDatePickerViewContext,
} from "./date-picker-context.js"

export interface CoreDatePickerRootProps
  extends
    Omit<DatePickerApiProps, "numOfMonths">,
    PresenceApiProps,
    Omit<ElementRenderProp<"div">, "defaultValue" | "dir"> {}

export function CoreDatePickerRoot({
  children,
  ...props
}: CoreDatePickerRootProps): ReactElement {
  const [presenceProps, otherProps] = splitPresenceProps(props)
  const [datePickerProps, localProps] = splitDatePickerProps(otherProps)

  const config = useMachine(datePickerMachine, datePickerProps)
  const api = createDatePickerApi(config, normalizeProps)

  const presence = usePresence(mergeProps({present: api.open}, presenceProps))

  const mergedProps = mergeProps(api.getRootBindings(), localProps)

  return (
    <DatePickerContextProvider value={api}>
      <PresenceContextProvider value={presence}>
        <PolymorphicElement as="div" {...mergedProps}>
          {children}
        </PolymorphicElement>
      </PresenceContextProvider>
    </DatePickerContextProvider>
  )
}

export interface CoreDatePickerClearTriggerProps
  extends ElementRenderProp<"button">, IdProp {}

export function CoreDatePickerClearTrigger({
  id,
  ...props
}: CoreDatePickerClearTriggerProps): ReactElement {
  const context = useDatePickerContext()
  const mergedProps = mergeProps(
    context.getClearTriggerBindings({
      id: useControlledId(id),
      onDestroy: useOnDestroy(),
    }),
    props,
  )

  return <PolymorphicElement as="button" {...mergedProps} />
}

export interface CoreDatePickerContentProps
  extends ElementRenderProp<"div">, IdProp {}

export function CoreDatePickerContent({
  id,
  ...props
}: CoreDatePickerContentProps): ReactElement | null {
  const context = useDatePickerContext()
  const presence = usePresenceContext()
  const mergedProps = mergeProps(
    context.getContentBindings({
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

export interface CoreDatePickerControlProps
  extends ElementRenderProp<"div">, IdProp {}

export function CoreDatePickerControl({
  id,
  ...props
}: CoreDatePickerControlProps): ReactElement {
  const context = useDatePickerContext()
  const mergedProps = mergeProps(
    context.getControlBindings({
      id: useControlledId(id),
      onDestroy: useOnDestroy(),
    }),
    props,
  )

  return <PolymorphicElement as="div" {...mergedProps} />
}

export interface CoreDatePickerErrorIndicatorProps extends ElementRenderProp<"span"> {}

export function CoreDatePickerErrorIndicator(
  props: CoreDatePickerErrorIndicatorProps,
): ReactElement {
  const context = useDatePickerContext()
  const mergedProps = mergeProps(context.getErrorIndicatorBindings(), props)

  return <PolymorphicElement as="span" {...mergedProps} />
}

export interface CoreDatePickerErrorTextProps
  extends ElementRenderProp<"div">, IdProp {}

export function CoreDatePickerErrorText({
  id,
  ...props
}: CoreDatePickerErrorTextProps): ReactElement {
  const context = useDatePickerContext()
  const mergedProps = mergeProps(
    context.getErrorTextBindings({
      id: useControlledId(id),
      onDestroy: useOnDestroy(),
    }),
    props,
  )

  return <PolymorphicElement as="div" {...mergedProps} />
}

export interface CoreDatePickerHintProps
  extends ElementRenderProp<"div">, IdProp {}

export function CoreDatePickerHint({
  id,
  ...props
}: CoreDatePickerHintProps): ReactElement {
  const context = useDatePickerContext()
  const mergedProps = mergeProps(
    context.getHintBindings({
      id: useControlledId(id),
      onDestroy: useOnDestroy(),
    }),
    props,
  )

  return <PolymorphicElement as="div" {...mergedProps} />
}

export interface CoreDatePickerInputProps
  extends ElementRenderProp<"input">, DatePickerApiInputProps, IdProp {}

export function CoreDatePickerInput({
  id,
  ...props
}: CoreDatePickerInputProps): ReactElement {
  const context = useDatePickerContext()
  const [inputProps, localProps] = splitDatePickerInputProps(props)
  const mergedProps = mergeProps(
    context.getInputBindings({
      id: useControlledId(id),
      onDestroy: useOnDestroy(),
      ...inputProps,
    }),
    localProps,
  )

  return <PolymorphicElement as="input" {...mergedProps} />
}

export interface CoreDatePickerLabelProps
  extends ElementRenderProp<"label">, DatePickerApiLabelProps {}

export function CoreDatePickerLabel(
  props: CoreDatePickerLabelProps,
): ReactElement {
  const context = useDatePickerContext()
  const [labelProps, localProps] = splitDatePickerLabelProps(props)
  const mergedProps = mergeProps(
    context.getLabelBindings(labelProps),
    localProps,
  )

  return <PolymorphicElement as="label" {...mergedProps} />
}

export interface CoreDatePickerNextTriggerProps
  extends ElementRenderProp<"button">, DatePickerApiViewProps {}

export function CoreDatePickerNextTrigger({
  view,
  ...props
}: CoreDatePickerNextTriggerProps): ReactElement {
  const context = useDatePickerContext()
  const viewContext = useDatePickerViewContext()
  const mergedProps = mergeProps(
    context.getNextTriggerBindings(view ? {...viewContext, view} : viewContext),
    props,
  )

  return <PolymorphicElement as="button" {...mergedProps} />
}

export interface CoreDatePickerPositionerProps
  extends ElementRenderProp<"div">, IdProp {}

export function CoreDatePickerPositioner({
  id,
  ...props
}: CoreDatePickerPositionerProps): ReactElement | null {
  const context = useDatePickerContext()
  const presence = usePresenceContext()
  const mergedProps = mergeProps(
    context.getPositionerBindings({
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

export interface CoreDatePickerPresetsProps extends ElementRenderProp<"div"> {}

export function CoreDatePickerPresets(
  props: CoreDatePickerPresetsProps,
): ReactElement {
  const context = useDatePickerContext()
  const mergedProps = mergeProps(context.getPresetsBindings(), props)

  return <PolymorphicElement as="div" {...mergedProps} />
}

export interface CoreDatePickerPresetsTriggerProps extends ElementRenderProp<"button"> {}

export function CoreDatePickerPresetsTrigger(
  props: CoreDatePickerPresetsTriggerProps,
): ReactElement {
  const context = useDatePickerContext()
  const mergedProps = mergeProps(context.getPresetsTriggerBindings(), props)

  return <PolymorphicElement as="button" {...mergedProps} />
}

export interface CoreDatePickerPresetTriggerProps
  extends
    Omit<ElementRenderProp<"button">, "value">,
    DatePickerApiPresetTriggerProps {}

export function CoreDatePickerPresetTrigger(
  props: CoreDatePickerPresetTriggerProps,
): ReactElement {
  const context = useDatePickerContext()
  const [presetProps, localProps] = splitDatePickerPresetTriggerProps(props)
  const mergedProps = mergeProps(
    context.getPresetTriggerBindings(presetProps),
    localProps,
  )

  return <PolymorphicElement as="button" {...mergedProps} />
}

export interface CoreDatePickerPrevTriggerProps
  extends ElementRenderProp<"button">, DatePickerApiViewProps {}

export function CoreDatePickerPrevTrigger({
  view,
  ...props
}: CoreDatePickerPrevTriggerProps): ReactElement {
  const context = useDatePickerContext()
  const viewContext = useDatePickerViewContext()
  const mergedProps = mergeProps(
    context.getPrevTriggerBindings(view ? {...viewContext, view} : viewContext),
    props,
  )

  return <PolymorphicElement as="button" {...mergedProps} />
}

export interface CoreDatePickerRangeTextProps extends ElementRenderProp<"div"> {}

export function CoreDatePickerRangeText(
  props: CoreDatePickerRangeTextProps,
): ReactElement {
  const context = useDatePickerContext()
  const mergedProps = mergeProps(context.getRangeTextBindings(), props)

  return <PolymorphicElement as="div" {...mergedProps} />
}

export interface CoreDatePickerTableProps
  extends ElementRenderProp<"table">, DatePickerApiTableProps {}

export function CoreDatePickerTable({
  children,
  columns,
  view,
  ...props
}: CoreDatePickerTableProps): ReactElement {
  const context = useDatePickerContext()
  const viewContext = useDatePickerViewContext()
  const tableProps: DatePickerApiTableProps = {
    ...viewContext,
    columns,
    ...(view ? {view} : {}),
  }
  const mergedProps = mergeProps(context.getTableBindings(tableProps), props)

  return (
    <DatePickerTableContextProvider value={tableProps}>
      <PolymorphicElement as="table" {...mergedProps}>
        {children}
      </PolymorphicElement>
    </DatePickerTableContextProvider>
  )
}

export interface CoreDatePickerTableBodyProps extends ElementRenderProp<"tbody"> {}

export function CoreDatePickerTableBody(
  props: CoreDatePickerTableBodyProps,
): ReactElement {
  const context = useDatePickerContext()
  const tableContext = useDatePickerTableContext()
  const mergedProps = mergeProps(
    context.getTableBodyBindings(tableContext),
    props,
  )

  return <PolymorphicElement as="tbody" {...mergedProps} />
}

export interface CoreDatePickerTableCellProps extends Omit<
  ElementRenderProp<"td">,
  "value"
> {
  columns?: number
  disabled?: boolean
  value: DateValue | number
  visibleRange?: DatePickerVisibleRange
}

export function CoreDatePickerTableCell({
  children,
  columns,
  disabled,
  value,
  visibleRange,
  ...props
}: CoreDatePickerTableCellProps): ReactElement {
  const context = useDatePickerContext()
  const {view} = useDatePickerTableContext()
  const cellProps = {columns, disabled, value, visibleRange} as
    | DatePickerApiDayTableCellProps
    | DatePickerApiTableCellProps

  let bindings
  switch (view) {
    case "month":
      bindings = context.getMonthTableCellBindings(
        cellProps as DatePickerApiTableCellProps,
      )
      break
    case "year":
      bindings = context.getYearTableCellBindings(
        cellProps as DatePickerApiTableCellProps,
      )
      break
    default:
      bindings = context.getDayTableCellBindings(
        cellProps as DatePickerApiDayTableCellProps,
      )
  }

  const mergedProps = mergeProps(bindings, props)

  return (
    <DatePickerTableCellContextProvider value={cellProps}>
      <PolymorphicElement as="td" {...mergedProps}>
        {children}
      </PolymorphicElement>
    </DatePickerTableCellContextProvider>
  )
}

export interface CoreDatePickerTableCellTriggerProps extends ElementRenderProp<"div"> {}

export function CoreDatePickerTableCellTrigger(
  props: CoreDatePickerTableCellTriggerProps,
): ReactElement {
  const context = useDatePickerContext()
  const cellContext = useDatePickerTableCellContext()
  const {view} = useDatePickerTableContext()

  let bindings
  switch (view) {
    case "month":
      bindings = context.getMonthTableCellTriggerBindings(
        cellContext as DatePickerApiTableCellProps,
      )
      break
    case "year":
      bindings = context.getYearTableCellTriggerBindings(
        cellContext as DatePickerApiTableCellProps,
      )
      break
    default:
      bindings = context.getDayTableCellTriggerBindings(
        cellContext as DatePickerApiDayTableCellProps,
      )
  }

  const mergedProps = mergeProps(bindings, props)

  return <PolymorphicElement as="div" {...mergedProps} />
}

export interface CoreDatePickerTableHeadProps extends ElementRenderProp<"thead"> {}

export function CoreDatePickerTableHead(
  props: CoreDatePickerTableHeadProps,
): ReactElement {
  const context = useDatePickerContext()
  const tableContext = useDatePickerTableContext()
  const mergedProps = mergeProps(
    context.getTableHeadBindings(tableContext),
    props,
  )

  return <PolymorphicElement as="thead" {...mergedProps} />
}

export interface CoreDatePickerTableHeaderProps extends ElementRenderProp<"th"> {}

export function CoreDatePickerTableHeader(
  props: CoreDatePickerTableHeaderProps,
): ReactElement {
  const context = useDatePickerContext()
  const tableContext = useDatePickerTableContext()
  const mergedProps = mergeProps(
    context.getTableHeaderBindings(tableContext),
    props,
  )

  return <PolymorphicElement as="th" {...mergedProps} />
}

export interface CoreDatePickerTableRowProps extends ElementRenderProp<"tr"> {}

export function CoreDatePickerTableRow(
  props: CoreDatePickerTableRowProps,
): ReactElement {
  const context = useDatePickerContext()
  const tableContext = useDatePickerTableContext()
  const mergedProps = mergeProps(
    context.getTableRowBindings(tableContext),
    props,
  )

  return <PolymorphicElement as="tr" {...mergedProps} />
}

export interface CoreDatePickerTriggerProps
  extends ElementRenderProp<"button">, IdProp {}

export function CoreDatePickerTrigger({
  id,
  ...props
}: CoreDatePickerTriggerProps): ReactElement {
  const context = useDatePickerContext()
  const mergedProps = mergeProps(
    context.getTriggerBindings({
      id: useControlledId(id),
      onDestroy: useOnDestroy(),
    }),
    props,
  )

  return <PolymorphicElement as="button" {...mergedProps} />
}

export interface CoreDatePickerViewProps
  extends ElementRenderProp<"div">, DatePickerApiViewProps {}

export function CoreDatePickerView({
  children,
  view,
  ...props
}: CoreDatePickerViewProps): ReactElement {
  const context = useDatePickerContext()
  const viewProps: DatePickerApiViewProps = {view}
  const mergedProps = mergeProps(context.getViewBindings(viewProps), props)

  return (
    <DatePickerViewContextProvider value={viewProps}>
      <PolymorphicElement as="div" {...mergedProps}>
        {children}
      </PolymorphicElement>
    </DatePickerViewContextProvider>
  )
}

export interface CoreDatePickerViewControlProps extends ElementRenderProp<"div"> {}

export function CoreDatePickerViewControl(
  props: CoreDatePickerViewControlProps,
): ReactElement {
  const context = useDatePickerContext()
  const viewContext = useDatePickerViewContext()
  const mergedProps = mergeProps(
    context.getViewControlBindings(viewContext),
    props,
  )

  return <PolymorphicElement as="div" {...mergedProps} />
}

export interface CoreDatePickerViewCloseTriggerProps extends ElementRenderProp<"button"> {}

export function CoreDatePickerViewCloseTrigger(
  props: CoreDatePickerViewCloseTriggerProps,
): ReactElement {
  const context = useDatePickerContext()
  const mergedProps = mergeProps(context.getViewCloseTriggerBindings(), props)

  return <PolymorphicElement as="button" {...mergedProps} />
}

export interface CoreDatePickerViewTriggerProps extends ElementRenderProp<"button"> {
  /**
   * Switch directly to this view when activated. When omitted, the trigger
   * toggles to the next view.
   */
  view?: DatePickerDateView
}

export function CoreDatePickerViewTrigger({
  view,
  ...props
}: CoreDatePickerViewTriggerProps): ReactElement {
  const context = useDatePickerContext()
  const viewContext = useDatePickerViewContext()
  const mergedProps = mergeProps(
    context.getViewTriggerBindings({goToView: view, view: viewContext.view}),
    props,
  )

  return <PolymorphicElement as="button" {...mergedProps} />
}

export interface CoreDatePickerContextProps {
  /**
   * {@link https://react-next.qui.qualcomm.com/render-props Render Prop}
   * that provides the current {@link DatePickerApi} context.
   *
   * @inheritDoc
   */
  children: RenderProp<DatePickerApi>
}

export function CoreDatePickerContext({
  children,
}: CoreDatePickerContextProps): ReactNode {
  const context = useDatePickerContext()
  return renderProp(children, context)
}
