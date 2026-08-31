// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreDatePicker,
  type CoreDatePickerTableCellTriggerProps,
} from "@qualcomm-ui/react-core/date-picker"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsDatePickerContext} from "./qds-date-picker-context.js"

export interface DatePickerTableCellTriggerProps extends CoreDatePickerTableCellTriggerProps {}

/**
 * The selectable trigger inside a calendar cell. Renders a `<div>` element by
 * default.
 */
export function DatePickerTableCellTrigger(
  props: DatePickerTableCellTriggerProps,
): ReactElement {
  const qdsContext = useQdsDatePickerContext()
  const mergedProps = mergeProps(
    qdsContext.getTableCellTriggerBindings(),
    props,
  )

  return <CoreDatePicker.TableCellTrigger {...mergedProps} />
}
