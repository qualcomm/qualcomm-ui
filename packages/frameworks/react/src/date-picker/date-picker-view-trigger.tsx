// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreDatePicker,
  type CoreDatePickerViewTriggerProps,
} from "@qualcomm-ui/react-core/date-picker"
import {Button} from "@qualcomm-ui/react/button"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsDatePickerContext} from "./qds-date-picker-context.js"

export interface DatePickerViewTriggerProps extends CoreDatePickerViewTriggerProps {}

/**
 * Switches to the next view level (day to month to year). Styled as a ghost
 * {@link Button}.
 */
export function DatePickerViewTrigger({
  render,
  ...props
}: DatePickerViewTriggerProps): ReactElement {
  const qdsContext = useQdsDatePickerContext()
  const mergedProps = mergeProps(qdsContext.getViewTriggerBindings(), props)

  return (
    <CoreDatePicker.ViewTrigger
      {...mergedProps}
      render={
        <Button density="compact" render={render} size="md" variant="ghost" />
      }
    />
  )
}
