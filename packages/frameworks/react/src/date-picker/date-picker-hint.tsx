// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreDatePicker,
  type CoreDatePickerHintProps,
} from "@qualcomm-ui/react-core/date-picker"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsDatePickerContext} from "./qds-date-picker-context.js"

export interface DatePickerHintProps extends CoreDatePickerHintProps {}

/**
 * Helper text displayed below the field. Hidden while the date picker is
 * invalid. Renders a `<div>` element by default.
 */
export function DatePickerHint(props: DatePickerHintProps): ReactElement {
  const qdsContext = useQdsDatePickerContext()
  const mergedProps = mergeProps(qdsContext.getHintBindings(), props)

  return <CoreDatePicker.Hint {...mergedProps} />
}
