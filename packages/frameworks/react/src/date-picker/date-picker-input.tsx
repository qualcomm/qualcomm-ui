// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreDatePicker,
  type CoreDatePickerInputProps,
} from "@qualcomm-ui/react-core/date-picker"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsDatePickerContext} from "./qds-date-picker-context.js"

export interface DatePickerInputProps extends CoreDatePickerInputProps {}

/**
 * The editable date input. Renders an `<input>` element by default.
 */
export function DatePickerInput(props: DatePickerInputProps): ReactElement {
  const qdsContext = useQdsDatePickerContext()
  const mergedProps = mergeProps(qdsContext.getInputBindings(), props)

  return <CoreDatePicker.Input {...mergedProps} />
}
