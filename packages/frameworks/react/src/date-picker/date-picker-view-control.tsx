// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreDatePicker,
  type CoreDatePickerViewControlProps,
} from "@qualcomm-ui/react-core/date-picker"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsDatePickerContext} from "./qds-date-picker-context.js"

export interface DatePickerViewControlProps extends CoreDatePickerViewControlProps {}

/**
 * Groups the navigation controls of a view. Renders a `<div>` element by
 * default.
 */
export function DatePickerViewControl(
  props: DatePickerViewControlProps,
): ReactElement {
  const qdsContext = useQdsDatePickerContext()
  const mergedProps = mergeProps(qdsContext.getViewControlBindings(), props)

  return <CoreDatePicker.ViewControl {...mergedProps} />
}
