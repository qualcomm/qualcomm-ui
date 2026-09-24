// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreDatePicker,
  type CoreDatePickerClearTriggerProps,
} from "@qualcomm-ui/react-core/date-picker"

export interface DatePickerClearTriggerProps extends CoreDatePickerClearTriggerProps {}

/**
 * A button that clears the selection. Renders a `<button>` element by default;
 * pass `render` to adopt your own element.
 *
 * @example
 * ```tsx
 * <DatePicker.ClearTrigger render={<Button variant="ghost" />}>
 *   Clear
 * </DatePicker.ClearTrigger>
 * ```
 */
export function DatePickerClearTrigger(
  props: DatePickerClearTriggerProps,
): ReactElement {
  return <CoreDatePicker.ClearTrigger {...props} />
}
