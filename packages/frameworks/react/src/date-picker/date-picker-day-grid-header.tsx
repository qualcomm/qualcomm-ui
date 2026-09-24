// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, useMemo} from "react"

import type {DatePickerWeekDay} from "@qualcomm-ui/core/date-picker"
import {useDatePickerContext} from "@qualcomm-ui/react-core/date-picker"

import {DatePickerTableHead} from "./date-picker-table-head.js"
import {DatePickerTableHeader} from "./date-picker-table-header.js"
import {DatePickerTableRow} from "./date-picker-table-row.js"

export interface DatePickerDayGridHeaderProps {
  /**
   * The format used to render the weekday labels.
   *
   * @default 'narrow'
   */
  format?: Extract<keyof DatePickerWeekDay, "long" | "narrow" | "short">
}

/**
 * Renders the weekday column headers for the day view.
 */
export function DatePickerDayGridHeader({
  format,
}: DatePickerDayGridHeaderProps): ReactElement {
  const {weekDays} = useDatePickerContext()

  const dayGridHeader = useMemo(
    () =>
      weekDays.map((weekDay, i) => (
        <DatePickerTableHeader key={i} aria-label={weekDay.long} scope="col">
          {weekDay[format ?? "narrow"]}
        </DatePickerTableHeader>
      )),
    [weekDays, format],
  )

  return (
    <DatePickerTableHead>
      <DatePickerTableRow>{dayGridHeader}</DatePickerTableRow>
    </DatePickerTableHead>
  )
}
