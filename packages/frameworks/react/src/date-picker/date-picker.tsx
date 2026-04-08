// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"
import {Calendar} from "lucide-react"

import {getCalendarDates} from "@qualcomm-ui/core/date-picker"
import {createQdsDatePickerApi, type QdsDatePickerApiProps} from "@qualcomm-ui/qds-core/date-picker"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {Portal} from "@qualcomm-ui/react-core/portal"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {
  CoreDatePickerCalendar,
  CoreDatePickerCell,
  CoreDatePickerClearTrigger,
  CoreDatePickerContent,
  CoreDatePickerControls,
  CoreDatePickerInput,
  CoreDatePickerLabel,
  CoreDatePickerNextTrigger,
  CoreDatePickerPositioner,
  CoreDatePickerPrevTrigger,
  CoreDatePickerRoot,
  type CoreDatePickerRootProps,
  CoreDatePickerTodayTrigger,
  CoreDatePickerTrigger,
  CoreDatePickerViewTrigger,
  useDatePickerContext,
} from "@qualcomm-ui/react-core/date-picker"

export interface DatePickerProps extends CoreDatePickerRootProps, QdsDatePickerApiProps {
  /**
   * When `true`, renders a clear button that resets the input value on click.
   * @default true
   */
  clearable?: boolean

  /**
   * Optional label for the date picker input
   */
  label?: ReactNode

  /**
   * Optional hint text displayed below the input
   */
  hint?: ReactNode

  /**
   * Optional error text displayed when invalid is true
   */
  errorText?: ReactNode
}

export function DatePicker({
  children,
  clearable = true,
  errorText,
  hint,
  label,
  size = "md",
  ...props
}: DatePickerProps): ReactElement {
  const qdsApi = createQdsDatePickerApi({size}, normalizeProps)

  return (
    <CoreDatePickerRoot {...props}>
      <div {...mergeProps(qdsApi.getRootBindings(), {})}>
        {label && (
          <CoreDatePickerLabel {...qdsApi.getLabelBindings()}>
            {label}
          </CoreDatePickerLabel>
        )}

        <div style={{display: "flex", gap: "8px", position: "relative"}}>
          <CoreDatePickerInput {...qdsApi.getInputBindings()} />
          <CoreDatePickerTrigger {...qdsApi.getTriggerBindings()}>
            <Calendar size={16} />
          </CoreDatePickerTrigger>
          {clearable && (
            <CoreDatePickerClearTrigger {...qdsApi.getClearTriggerBindings()}>
              ×
            </CoreDatePickerClearTrigger>
          )}
        </div>

        {hint && <div style={{fontSize: "12px", marginTop: "4px"}}>{hint}</div>}
        {errorText && <div style={{color: "red", fontSize: "12px", marginTop: "4px"}}>{errorText}</div>}

        <Portal>
          <CoreDatePickerPositioner {...qdsApi.getPositionerBindings()}>
            <CoreDatePickerContent {...qdsApi.getContentBindings()}>
              <CoreDatePickerControls {...qdsApi.getControlsBindings()}>
                <CoreDatePickerPrevTrigger>←</CoreDatePickerPrevTrigger>
                <CoreDatePickerViewTrigger />
                <CoreDatePickerNextTrigger>→</CoreDatePickerNextTrigger>
              </CoreDatePickerControls>

              <DatePickerCalendarView />

              <CoreDatePickerTodayTrigger {...qdsApi.getTodayTriggerBindings()}>
                Today
              </CoreDatePickerTodayTrigger>
            </CoreDatePickerContent>
          </CoreDatePickerPositioner>
        </Portal>

        {children}
      </div>
    </CoreDatePickerRoot>
  )
}

function DatePickerCalendarView(): ReactElement {
  const context = useDatePickerContext()
  const focusedDate = context.focusedDate
  const calendarDates = getCalendarDates(focusedDate)

  const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

  return (
    <CoreDatePickerCalendar>
      <thead>
        <tr>
          {weekdays.map((day, index) => (
            <th key={index} style={{padding: "8px", fontSize: "12px", fontWeight: "normal"}}>
              {day}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({length: Math.ceil(calendarDates.length / 7)}).map((_, weekIndex) => (
          <tr key={weekIndex}>
            {calendarDates.slice(weekIndex * 7, (weekIndex + 1) * 7).map((date) => (
              <td key={date.toString()} style={{padding: "2px"}}>
                <CoreDatePickerCell date={date} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </CoreDatePickerCalendar>
  )
}
