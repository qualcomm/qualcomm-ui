// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, useMemo} from "react"

import {datePickerViewColumns} from "@qualcomm-ui/qds-core/date-picker"
import {useDatePickerContext} from "@qualcomm-ui/react-core/date-picker"

import {DatePickerTableBody} from "./date-picker-table-body.js"
import {DatePickerTableCellTrigger} from "./date-picker-table-cell-trigger.js"
import {DatePickerTableCell} from "./date-picker-table-cell.js"
import {DatePickerTableRow} from "./date-picker-table-row.js"

/**
 * Renders the year cells for the year view.
 */
export function DatePickerYearGrid(): ReactElement {
  const {getYearsGrid} = useDatePickerContext()

  const yearsGrid = useMemo(
    () =>
      getYearsGrid({columns: datePickerViewColumns.year}).map((years, row) => (
        <DatePickerTableRow key={row}>
          {years.map((year, index) => (
            <DatePickerTableCell key={index} value={year.value}>
              <DatePickerTableCellTrigger>
                {year.label}
              </DatePickerTableCellTrigger>
            </DatePickerTableCell>
          ))}
        </DatePickerTableRow>
      )),
    [getYearsGrid],
  )

  return <DatePickerTableBody>{yearsGrid}</DatePickerTableBody>
}
