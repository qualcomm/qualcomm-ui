// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {ChevronRight} from "lucide-react"

import {
  CoreDatePicker,
  type CoreDatePickerNextTriggerProps,
} from "@qualcomm-ui/react-core/date-picker"
import type {LucideIconOrElement} from "@qualcomm-ui/react-core/lucide"
import {IconButton} from "@qualcomm-ui/react/button"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsDatePickerContext} from "./qds-date-picker-context.js"

export interface DatePickerNextTriggerProps extends CoreDatePickerNextTriggerProps {
  /**
   * Icon to render. Accepts a `LucideIcon` or a `ReactElement`.
   *
   * @default ChevronRight
   */
  icon?: LucideIconOrElement
}

/**
 * Advances the calendar to the next page. Styled as a ghost {@link IconButton}.
 */
export function DatePickerNextTrigger({
  icon = ChevronRight,
  render,
  ...props
}: DatePickerNextTriggerProps): ReactElement {
  const qdsContext = useQdsDatePickerContext()
  const mergedProps = mergeProps(qdsContext.getNextTriggerBindings(), props)

  return (
    <CoreDatePicker.NextTrigger
      {...mergedProps}
      render={
        <IconButton
          density="compact"
          icon={icon}
          render={render}
          size="md"
          variant="ghost"
        />
      }
    />
  )
}
