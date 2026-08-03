// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, useMemo} from "react"

import type {DatePickerApiMonthGridProps} from "@qualcomm-ui/core/date-picker"
import {datePickerViewColumns} from "@qualcomm-ui/qds-core/date-picker"
import {useDatePickerContext} from "@qualcomm-ui/react-core/date-picker"

import {DatePickerTableBody} from "./date-picker-table-body.js"
import {DatePickerTableCellTrigger} from "./date-picker-table-cell-trigger.js"
import {DatePickerTableCell} from "./date-picker-table-cell.js"
import {DatePickerTableRow} from "./date-picker-table-row.js"

export interface DatePickerMonthGridProps {
  /**
   * The format used to render the month labels.
   *
   * @default 'short'
   */
  format?: DatePickerApiMonthGridProps["format"]
}

/**
 * Renders the month cells for the month view.
 */
export function DatePickerMonthGrid({
  format = "short",
}: DatePickerMonthGridProps): ReactElement {
  const {getMonthsGrid} = useDatePickerContext()

  const monthsGrid = useMemo(
    () =>
      getMonthsGrid({columns: datePickerViewColumns.month, format}).map(
        (months, row) => (
          <DatePickerTableRow key={row}>
            {months.map((month, index) => (
              <DatePickerTableCell key={index} value={month.value}>
                <DatePickerTableCellTrigger>
                  {month.label}
                </DatePickerTableCellTrigger>
              </DatePickerTableCell>
            ))}
          </DatePickerTableRow>
        ),
      ),
    [format, getMonthsGrid],
  )

  return <DatePickerTableBody>{monthsGrid}</DatePickerTableBody>
}
