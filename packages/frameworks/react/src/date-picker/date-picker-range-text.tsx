// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreDatePicker,
  type CoreDatePickerRangeTextProps,
  useDatePickerContext,
} from "@qualcomm-ui/react-core/date-picker"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsDatePickerContext} from "./qds-date-picker-context.js"

export interface DatePickerRangeTextProps extends CoreDatePickerRangeTextProps {}

/**
 * Human readable text for the visible range. The text is view-aware (month and
 * year for the day view, the year for the month view, and the decade for the
 * year view). Renders a `<div>` element by default.
 */
export function DatePickerRangeText(
  props: DatePickerRangeTextProps,
): ReactElement {
  const qdsContext = useQdsDatePickerContext()
  const {visibleRangeText} = useDatePickerContext()
  const mergedProps = mergeProps(qdsContext.getRangeTextBindings(), props)

  return (
    <CoreDatePicker.RangeText {...mergedProps}>
      {visibleRangeText.formatted}
    </CoreDatePicker.RangeText>
  )
}
