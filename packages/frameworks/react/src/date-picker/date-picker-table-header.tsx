// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreDatePicker,
  type CoreDatePickerTableHeaderProps,
} from "@qualcomm-ui/react-core/date-picker"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsDatePickerContext} from "./qds-date-picker-context.js"

export interface DatePickerTableHeaderProps extends CoreDatePickerTableHeaderProps {}

/**
 * A column header in the calendar grid. Renders a `<th>` element by default.
 */
export function DatePickerTableHeader(
  props: DatePickerTableHeaderProps,
): ReactElement {
  const qdsContext = useQdsDatePickerContext()
  const mergedProps = mergeProps(qdsContext.getTableHeaderBindings(), props)

  return <CoreDatePicker.TableHeader {...mergedProps} />
}
