// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, useMemo} from "react"

import {useDatePickerContext} from "@qualcomm-ui/react-core/date-picker"

import {DatePickerTableBody} from "./date-picker-table-body.js"
import {DatePickerTableCellTrigger} from "./date-picker-table-cell-trigger.js"
import {DatePickerTableCell} from "./date-picker-table-cell.js"
import {DatePickerTableRow} from "./date-picker-table-row.js"

export interface DatePickerDayGridProps {}

/**
 * Renders the day cells for the visible month.
 */
export function DatePickerDayGrid(): ReactElement {
  const {visibleRange, weeks} = useDatePickerContext()

  const dayGrid = useMemo(
    () =>
      weeks.map((week, i) => (
        <DatePickerTableRow key={i}>
          {week.map((day, idx) => (
            <DatePickerTableCell
              key={idx}
              value={day}
              visibleRange={visibleRange}
            >
              <DatePickerTableCellTrigger>{day.day}</DatePickerTableCellTrigger>
            </DatePickerTableCell>
          ))}
        </DatePickerTableRow>
      )),
    [visibleRange, weeks],
  )

  return <DatePickerTableBody>{dayGrid}</DatePickerTableBody>
}
