// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import type {DatePickerPresetTriggerValue} from "@qualcomm-ui/core/date-picker"
import {Portal, type PortalProps} from "@qualcomm-ui/react-core/portal"

import {
  DatePickerActions,
  type DatePickerActionsProps,
} from "./date-picker-actions.js"
import {DatePickerCancelTrigger} from "./date-picker-cancel-trigger.js"
import {
  DatePickerContent,
  type DatePickerContentProps,
} from "./date-picker-content.js"
import {
  DatePickerControl,
  type DatePickerControlProps,
} from "./date-picker-control.js"
import {DatePickerDayGridHeader} from "./date-picker-day-grid-header.js"
import {DatePickerDayGrid} from "./date-picker-day-grid.js"
import {
  DatePickerErrorText,
  type DatePickerErrorTextProps,
} from "./date-picker-error-text.js"
import {DatePickerHeadlineLabel} from "./date-picker-headline-label.js"
import {
  DatePickerHeadlineValue,
  type DatePickerHeadlineValueProps,
} from "./date-picker-headline-value.js"
import {
  DatePickerHeadline,
  type DatePickerHeadlineProps,
} from "./date-picker-headline.js"
import {DatePickerHint, type DatePickerHintProps} from "./date-picker-hint.js"
import {
  DatePickerInputGroup,
  type DatePickerInputGroupProps,
} from "./date-picker-input-group.js"
import {DatePickerMonthGrid} from "./date-picker-month-grid.js"
import {DatePickerMonthText} from "./date-picker-month-text.js"
import {DatePickerNextTrigger} from "./date-picker-next-trigger.js"
import {DatePickerOkTrigger} from "./date-picker-ok-trigger.js"
import {
  DatePickerPositioner,
  type DatePickerPositionerProps,
} from "./date-picker-positioner.js"
import {DatePickerPresetTrigger} from "./date-picker-preset-trigger.js"
import {DatePickerPresetsTrigger} from "./date-picker-presets-trigger.js"
import {
  DatePickerPresets,
  type DatePickerPresetsProps,
} from "./date-picker-presets.js"
import {DatePickerPrevTrigger} from "./date-picker-prev-trigger.js"
import {DatePickerRoot, type DatePickerRootProps} from "./date-picker-root.js"
import {DatePickerTable} from "./date-picker-table.js"
import {DatePickerViewCloseTrigger} from "./date-picker-view-close-trigger.js"
import {DatePickerViewControl} from "./date-picker-view-control.js"
import {DatePickerViewTrigger} from "./date-picker-view-trigger.js"
import {DatePickerView} from "./date-picker-view.js"
import {DatePickerYearGrid} from "./date-picker-year-grid.js"
import {DatePickerYearText} from "./date-picker-year-text.js"

export interface DatePickerPreset {
  /**
   * Text rendered inside the preset trigger.
   */
  label: ReactNode

  /**
   * The value applied when the preset is selected. Either a named range preset
   * (e.g. `"next7Days"`) or an explicit array of dates.
   */
  value: DatePickerPresetTriggerValue
}

export type DatePickerVariant = "input" | "inline"

export interface DatePickerProps extends Omit<
  DatePickerRootProps,
  "children" | "inline" | "maxView" | "minView"
> {
  /**
   * Props applied to the actions footer element.
   *
   * @inheritDoc
   */
  actionsProps?: Omit<DatePickerActionsProps, "children">

  /**
   * Props applied to the content element.
   *
   * @inheritDoc
   */
  contentProps?: Omit<DatePickerContentProps, "children">

  /**
   * Props applied to the control element.
   *
   * @inheritDoc
   */
  controlProps?: Omit<DatePickerControlProps, "children">

  /**
   * Optional error that describes the element when {@link invalid} is true.
   */
  errorText?: ReactNode

  /**
   * Props applied to the error text element.
   *
   * @inheritDoc
   */
  errorTextProps?: DatePickerErrorTextProps

  /**
   * Whether to render the headline (label and selected value) above the
   * calendar. Only applies to the `inline` variant.
   *
   * @default true
   */
  headline?: boolean

  /**
   * Props applied to the headline element rendered by the `inline` variant.
   *
   * @inheritDoc
   */
  headlineProps?: Omit<DatePickerHeadlineProps, "children">

  /**
   * Props applied to the headline value element rendered by the `inline`
   * variant.
   *
   * @inheritDoc
   */
  headlineValueProps?: DatePickerHeadlineValueProps

  /**
   * Optional hint describing the element. This element is automatically
   * associated with the component's input element for accessibility.
   */
  hint?: ReactNode

  /**
   * Props applied to the hint element.
   *
   * @inheritDoc
   */
  hintProps?: DatePickerHintProps

  /**
   * Props applied to the input group element.
   *
   * @inheritDoc
   */
  inputGroupProps?: DatePickerInputGroupProps

  /**
   * Label text rendered above the field.
   */
  label?: string

  /**
   * Props applied to the portal element.
   *
   * @inheritDoc
   */
  portalProps?: PortalProps

  /**
   * Props applied to the positioner element.
   *
   * @inheritDoc
   */
  positionerProps?: Omit<DatePickerPositionerProps, "children">

  /**
   * Quick-select presets shown alongside the calendar. When provided, a toggle
   * is rendered in the day view to reveal the preset list.
   */
  presets?: DatePickerPreset[]

  /**
   * Props applied to the presets element.
   *
   * @inheritDoc
   */
  presetsProps?: Omit<DatePickerPresetsProps, "children">

  /**
   * The presentation of the date picker.
   * - `input` - a labelled field that opens the calendar in a popover.
   * - `inline` - an always-visible, flat calendar that commits on selection.
   *
   * @default "input"
   */
  variant?: DatePickerVariant
}

interface CalendarViewsOptions {
  showPresetsTrigger: boolean
}

function renderSubView(view: "month" | "year"): ReactNode {
  return (
    <DatePickerView view={view}>
      <DatePickerViewControl>
        <DatePickerViewTrigger disabled view="month">
          <DatePickerMonthText />
        </DatePickerViewTrigger>
        <DatePickerViewTrigger disabled view="year">
          <DatePickerYearText />
        </DatePickerViewTrigger>
        <DatePickerPrevTrigger />
        <DatePickerNextTrigger />
        <DatePickerViewCloseTrigger />
      </DatePickerViewControl>
      <DatePickerTable>
        {view === "month" ? <DatePickerMonthGrid /> : <DatePickerYearGrid />}
      </DatePickerTable>
    </DatePickerView>
  )
}

function renderCalendarViews({
  showPresetsTrigger,
}: CalendarViewsOptions): ReactNode {
  return (
    <>
      <DatePickerView view="day">
        <DatePickerViewControl>
          <DatePickerViewTrigger view="month">
            <DatePickerMonthText />
          </DatePickerViewTrigger>
          <DatePickerViewTrigger view="year">
            <DatePickerYearText />
          </DatePickerViewTrigger>
          <DatePickerPrevTrigger />
          <DatePickerNextTrigger />
          {showPresetsTrigger ? <DatePickerPresetsTrigger /> : null}
        </DatePickerViewControl>
        <DatePickerTable>
          <DatePickerDayGridHeader />
          <DatePickerDayGrid />
        </DatePickerTable>
      </DatePickerView>

      {renderSubView("month")}
      {renderSubView("year")}
    </>
  )
}

/**
 * A date picker with the full calendar composed for you. Defaults to a labelled
 * field that opens a calendar popover; use {@link variant} for an always-on
 * `inline` calendar. For finer control, compose the parts yourself with
 * {@link DatePicker.Root} and friends.
 */
export function DatePicker({
  actionsProps,
  contentProps,
  controlProps,
  errorText,
  errorTextProps,
  headline = true,
  headlineProps,
  headlineValueProps,
  hint,
  hintProps,
  inputGroupProps,
  label,
  portalProps,
  positionerProps,
  presets,
  presetsProps,
  variant = "input",
  ...props
}: DatePickerProps): ReactElement {
  const {closeOnSelect, selectionMode} = props
  const hasPresets = !!presets?.length
  const hintContent = hint || hintProps?.children
  const errorTextContent = errorText || errorTextProps?.children
  const isInline = variant === "inline"

  const showActions =
    !isInline && (closeOnSelect === false || selectionMode === "multiple")

  const resolvedCloseOnSelect = showActions ? false : closeOnSelect

  const presetsBlock = hasPresets ? (
    <DatePickerPresets {...presetsProps}>
      {presets.map((preset, index) => (
        <DatePickerPresetTrigger key={index} value={preset.value}>
          {preset.label}
        </DatePickerPresetTrigger>
      ))}
    </DatePickerPresets>
  ) : null

  const actionsBlock = showActions ? (
    <DatePickerActions {...actionsProps}>
      <DatePickerCancelTrigger />
      <DatePickerOkTrigger />
    </DatePickerActions>
  ) : null

  if (isInline) {
    return (
      <DatePickerRoot {...props} closeOnSelect={resolvedCloseOnSelect} inline>
        <DatePickerContent {...contentProps} data-variant="inline">
          {headline ? (
            <DatePickerHeadline {...headlineProps}>
              <DatePickerHeadlineLabel />
              <DatePickerHeadlineValue {...headlineValueProps} />
            </DatePickerHeadline>
          ) : null}
          {renderCalendarViews({showPresetsTrigger: hasPresets})}
          {presetsBlock}
          {actionsBlock}
        </DatePickerContent>
      </DatePickerRoot>
    )
  }

  return (
    <DatePickerRoot {...props} closeOnSelect={resolvedCloseOnSelect}>
      <DatePickerControl {...controlProps}>
        <DatePickerInputGroup label={label} {...inputGroupProps} />
      </DatePickerControl>

      {hintContent ? (
        <DatePickerHint {...hintProps}>{hintContent}</DatePickerHint>
      ) : null}
      {errorTextContent ? (
        <DatePickerErrorText {...errorTextProps}>
          {errorTextContent}
        </DatePickerErrorText>
      ) : null}

      <Portal {...portalProps}>
        <DatePickerPositioner {...positionerProps}>
          <DatePickerContent {...contentProps}>
            {renderCalendarViews({showPresetsTrigger: hasPresets})}
            {presetsBlock}
            {actionsBlock}
          </DatePickerContent>
        </DatePickerPositioner>
      </Portal>
    </DatePickerRoot>
  )
}
