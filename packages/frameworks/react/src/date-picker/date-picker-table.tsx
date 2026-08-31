// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {CSSProperties, ReactElement} from "react"

import {datePickerViewColumns} from "@qualcomm-ui/qds-core/date-picker"
import {
  CoreDatePicker,
  type CoreDatePickerTableProps,
  useDatePickerViewContext,
} from "@qualcomm-ui/react-core/date-picker"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsDatePickerContext} from "./qds-date-picker-context.js"

/**
 * The machine accepts a custom `columns` prop, we use fixed values.
 */
export interface DatePickerTableProps extends Omit<
  CoreDatePickerTableProps,
  "columns" | "view"
> {}

/**
 * The calendar grid. Renders a `<table>` element by default.
 */
export function DatePickerTable(props: DatePickerTableProps): ReactElement {
  const qdsContext = useQdsDatePickerContext()
  const {view} = useDatePickerViewContext()
  const columns = view ? datePickerViewColumns[view] : undefined
  const mergedProps = mergeProps(
    qdsContext.getTableBindings(),
    columns ? {columns, style: {"--columns": columns} as CSSProperties} : {},
    props,
  )

  return <CoreDatePicker.Table {...mergedProps} />
}
