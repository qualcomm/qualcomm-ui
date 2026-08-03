// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {X} from "lucide-react"

import type {CoreDatePickerClearTriggerProps} from "@qualcomm-ui/react-core/date-picker"
import {IconButton} from "@qualcomm-ui/react/button"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {DatePickerClearTrigger} from "./date-picker-clear-trigger.js"
import {useQdsDatePickerContext} from "./qds-date-picker-context.js"

export interface DatePickerInputClearTriggerProps extends CoreDatePickerClearTriggerProps {}

/**
 * Clears the selection, styled as a compact {@link IconButton}, used inside
 * {@link DatePickerInputGroup}.
 */
export function DatePickerInputClearTrigger({
  render,
  ...props
}: DatePickerInputClearTriggerProps): ReactElement {
  const qdsContext = useQdsDatePickerContext()
  const mergedProps = mergeProps(qdsContext.getClearTriggerBindings(), props)

  return (
    <DatePickerClearTrigger
      {...mergedProps}
      render={
        <IconButton
          density="compact"
          icon={X}
          render={render}
          size={qdsContext.triggerSize}
          variant="ghost"
        />
      }
    />
  )
}
