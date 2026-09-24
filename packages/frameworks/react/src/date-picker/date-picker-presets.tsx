// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreDatePicker,
  type CoreDatePickerPresetsProps,
} from "@qualcomm-ui/react-core/date-picker"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsDatePickerContext} from "./qds-date-picker-context.js"

export interface DatePickerPresetsProps extends CoreDatePickerPresetsProps {}

/**
 * Panel that lists {@link DatePickerPresetTrigger} options in place of the
 * calendar while the {@link DatePickerPresetsTrigger} is toggled on. Renders a
 * `<div>` element by default.
 */
export function DatePickerPresets(props: DatePickerPresetsProps): ReactElement {
  const qdsContext = useQdsDatePickerContext()
  const mergedProps = mergeProps(qdsContext.getPresetsBindings(), props)

  return <CoreDatePicker.Presets {...mergedProps} />
}
