// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {X} from "lucide-react"

import {
  CoreDatePicker,
  type CoreDatePickerViewCloseTriggerProps,
} from "@qualcomm-ui/react-core/date-picker"
import {IconButton} from "@qualcomm-ui/react/button"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsDatePickerContext} from "./qds-date-picker-context.js"

export interface DatePickerViewCloseTriggerProps extends CoreDatePickerViewCloseTriggerProps {}

/**
 * Returns from the month or year view to the day calendar. Styled as an outline
 * {@link IconButton}.
 */
export function DatePickerViewCloseTrigger({
  render,
  ...props
}: DatePickerViewCloseTriggerProps): ReactElement {
  const qdsContext = useQdsDatePickerContext()
  const mergedProps = mergeProps(
    qdsContext.getViewCloseTriggerBindings(),
    props,
  )

  return (
    <CoreDatePicker.ViewCloseTrigger
      {...mergedProps}
      render={
        <IconButton
          density="compact"
          icon={X}
          render={render}
          shape="square"
          size="sm"
          variant="outline"
        />
      }
    />
  )
}
