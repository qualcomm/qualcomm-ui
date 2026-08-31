// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {useDatePickerContext} from "@qualcomm-ui/react-core/date-picker"

export interface DatePickerYearTextProps {
  /**
   * The format used to render the visible year.
   *
   * @default 'numeric'
   */
  format?: "2-digit" | "numeric"
}

/**
 * Renders the currently visible year. Intended as the label for a `ViewTrigger`
 * that jumps to the year view.
 */
export function DatePickerYearText({
  format = "numeric",
}: DatePickerYearTextProps): ReactElement {
  const {format: formatDate, visibleRange} = useDatePickerContext()
  return <>{formatDate(visibleRange.start, {year: format})}</>
}
