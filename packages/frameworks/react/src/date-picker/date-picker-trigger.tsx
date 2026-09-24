// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreDatePicker,
  type CoreDatePickerTriggerProps,
} from "@qualcomm-ui/react-core/date-picker"

export interface DatePickerTriggerProps extends CoreDatePickerTriggerProps {}

/**
 * A button that opens and closes the calendar. Registers the trigger with the
 * date picker so accessibility and focus restoration work. Renders a `<button>`
 * element by default; pass `render` to adopt your own element.
 *
 * @example
 * ```tsx
 * <DatePicker.Trigger render={<Button variant="outline" />}>
 *   Pick a date
 * </DatePicker.Trigger>
 * ```
 */
export function DatePickerTrigger(props: DatePickerTriggerProps): ReactElement {
  return <CoreDatePicker.Trigger {...props} />
}
