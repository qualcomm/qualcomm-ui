// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreDatePicker,
  type CoreDatePickerLabelProps,
} from "@qualcomm-ui/react-core/date-picker"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsDatePickerContext} from "./qds-date-picker-context.js"

export interface DatePickerLabelProps extends CoreDatePickerLabelProps {}

/**
 * Label for the date input. Renders a `<label>` element by default.
 */
export function DatePickerLabel(props: DatePickerLabelProps): ReactElement {
  const qdsContext = useQdsDatePickerContext()
  const mergedProps = mergeProps(qdsContext.getLabelBindings(), props)

  return <CoreDatePicker.Label {...mergedProps} />
}
