// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {useDatePickerContext} from "@qualcomm-ui/react-core/date-picker"

export interface DatePickerMonthTextProps {
  /**
   * The format used to render the visible month.
   *
   * @default 'long'
   */
  format?: "2-digit" | "long" | "narrow" | "numeric" | "short"
}

/**
 * Renders the name of the currently visible month. Intended as the label for a
 * `ViewTrigger` that jumps to the month view.
 */
export function DatePickerMonthText({
  format = "long",
}: DatePickerMonthTextProps): ReactElement {
  const {format: formatDate, visibleRange} = useDatePickerContext()
  return <>{formatDate(visibleRange.start, {month: format})}</>
}
