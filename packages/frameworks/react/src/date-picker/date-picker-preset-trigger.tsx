// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreDatePicker,
  type CoreDatePickerPresetTriggerProps,
} from "@qualcomm-ui/react-core/date-picker"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsDatePickerContext} from "./qds-date-picker-context.js"

export interface DatePickerPresetTriggerProps extends CoreDatePickerPresetTriggerProps {}

/**
 * Selects a preset date or range. Renders a `<button>` element by default.
 */
export function DatePickerPresetTrigger(
  props: DatePickerPresetTriggerProps,
): ReactElement {
  const qdsContext = useQdsDatePickerContext()
  const mergedProps = mergeProps(qdsContext.getPresetTriggerBindings(), props)

  return <CoreDatePicker.PresetTrigger {...mergedProps} />
}
