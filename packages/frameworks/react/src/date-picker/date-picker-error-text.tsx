// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreDatePicker,
  type CoreDatePickerErrorTextProps,
} from "@qualcomm-ui/react-core/date-picker"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsDatePickerContext} from "./qds-date-picker-context.js"

export interface DatePickerErrorTextProps extends CoreDatePickerErrorTextProps {}

/**
 * Error message displayed when the date picker is invalid. Renders a `<div>`
 * element by default.
 */
export function DatePickerErrorText(
  props: DatePickerErrorTextProps,
): ReactElement {
  const qdsContext = useQdsDatePickerContext()
  const mergedProps = mergeProps(qdsContext.getErrorTextBindings(), props)

  return <CoreDatePicker.ErrorText {...mergedProps} />
}
