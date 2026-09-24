// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreDatePicker,
  type CoreDatePickerControlProps,
} from "@qualcomm-ui/react-core/date-picker"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsDatePickerContext} from "./qds-date-picker-context.js"

export interface DatePickerControlProps extends CoreDatePickerControlProps {}

/**
 * Container for the input and triggers. Renders a `<div>` element by default.
 */
export function DatePickerControl(props: DatePickerControlProps): ReactElement {
  const qdsContext = useQdsDatePickerContext()
  const mergedProps = mergeProps(qdsContext.getControlBindings(), props)

  return <CoreDatePicker.Control {...mergedProps} />
}
