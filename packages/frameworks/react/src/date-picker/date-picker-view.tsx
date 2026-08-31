// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreDatePicker,
  type CoreDatePickerViewProps,
} from "@qualcomm-ui/react-core/date-picker"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsDatePickerContext} from "./qds-date-picker-context.js"

export interface DatePickerViewProps extends CoreDatePickerViewProps {}

/**
 * Groups a single calendar view (day, month, or year). Renders a `<div>`
 * element by default.
 */
export function DatePickerView(props: DatePickerViewProps): ReactElement {
  const qdsContext = useQdsDatePickerContext()
  const mergedProps = mergeProps(qdsContext.getViewBindings(), props)

  return <CoreDatePicker.View {...mergedProps} />
}
