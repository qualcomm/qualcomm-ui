// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreDatePicker,
  type CoreDatePickerTableBodyProps,
} from "@qualcomm-ui/react-core/date-picker"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsDatePickerContext} from "./qds-date-picker-context.js"

export interface DatePickerTableBodyProps extends CoreDatePickerTableBodyProps {}

/**
 * The calendar grid body. Renders a `<tbody>` element by default.
 */
export function DatePickerTableBody(
  props: DatePickerTableBodyProps,
): ReactElement {
  const qdsContext = useQdsDatePickerContext()
  const mergedProps = mergeProps(qdsContext.getTableBodyBindings(), props)

  return <CoreDatePicker.TableBody {...mergedProps} />
}
