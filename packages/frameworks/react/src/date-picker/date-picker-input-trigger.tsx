// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {Calendar} from "lucide-react"

import type {CoreDatePickerTriggerProps} from "@qualcomm-ui/react-core/date-picker"
import {IconButton} from "@qualcomm-ui/react/button"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {DatePickerTrigger} from "./date-picker-trigger.js"
import {useQdsDatePickerContext} from "./qds-date-picker-context.js"

export interface DatePickerInputTriggerProps extends CoreDatePickerTriggerProps {}

/**
 * Calendar toggle styled as a compact {@link IconButton}, used inside
 * {@link DatePickerInputGroup}.
 */
export function DatePickerInputTrigger({
  render,
  ...props
}: DatePickerInputTriggerProps): ReactElement {
  const qdsContext = useQdsDatePickerContext()
  const mergedProps = mergeProps(qdsContext.getTriggerBindings(), props)

  return (
    <DatePickerTrigger
      {...mergedProps}
      render={
        <IconButton
          density="compact"
          icon={Calendar}
          render={render}
          size={qdsContext.triggerSize}
          variant="ghost"
        />
      }
    />
  )
}
