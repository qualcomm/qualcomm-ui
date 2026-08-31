// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreDatePicker,
  type CoreDatePickerContentProps,
} from "@qualcomm-ui/react-core/date-picker"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsDatePickerContext} from "./qds-date-picker-context.js"

export interface DatePickerContentProps extends CoreDatePickerContentProps {}

/**
 * Container for the calendar. Renders a `<div>` element by default.
 */
export function DatePickerContent(props: DatePickerContentProps): ReactElement {
  const qdsContext = useQdsDatePickerContext()
  const mergedProps = mergeProps(qdsContext.getContentBindings(), props)

  return <CoreDatePicker.Content {...mergedProps} />
}
