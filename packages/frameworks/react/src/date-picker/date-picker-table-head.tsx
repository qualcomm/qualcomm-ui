// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreDatePicker,
  type CoreDatePickerTableHeadProps,
} from "@qualcomm-ui/react-core/date-picker"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsDatePickerContext} from "./qds-date-picker-context.js"

export interface DatePickerTableHeadProps extends CoreDatePickerTableHeadProps {}

/**
 * The calendar grid header. Renders a `<thead>` element by default.
 */
export function DatePickerTableHead(
  props: DatePickerTableHeadProps,
): ReactElement {
  const qdsContext = useQdsDatePickerContext()
  const mergedProps = mergeProps(qdsContext.getTableHeadBindings(), props)

  return <CoreDatePicker.TableHead {...mergedProps} />
}
