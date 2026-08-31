// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreDatePicker,
  type CoreDatePickerTableCellProps,
} from "@qualcomm-ui/react-core/date-picker"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsDatePickerContext} from "./qds-date-picker-context.js"

export interface DatePickerTableCellProps extends CoreDatePickerTableCellProps {}

/**
 * A single cell in the calendar grid. Renders a `<td>` element by default.
 */
export function DatePickerTableCell(
  props: DatePickerTableCellProps,
): ReactElement {
  const qdsContext = useQdsDatePickerContext()
  const mergedProps = mergeProps(qdsContext.getTableCellBindings(), props)

  return <CoreDatePicker.TableCell {...mergedProps} />
}
