// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreDatePicker,
  type CoreDatePickerTableRowProps,
} from "@qualcomm-ui/react-core/date-picker"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsDatePickerContext} from "./qds-date-picker-context.js"

export interface DatePickerTableRowProps extends CoreDatePickerTableRowProps {}

/**
 * A row in the calendar grid. Renders a `<tr>` element by default.
 */
export function DatePickerTableRow(
  props: DatePickerTableRowProps,
): ReactElement {
  const qdsContext = useQdsDatePickerContext()
  const mergedProps = mergeProps(qdsContext.getTableRowBindings(), props)

  return <CoreDatePicker.TableRow {...mergedProps} />
}
