// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {ChevronLeft} from "lucide-react"

import {
  CoreDatePicker,
  type CoreDatePickerPrevTriggerProps,
} from "@qualcomm-ui/react-core/date-picker"
import type {LucideIconOrElement} from "@qualcomm-ui/react-core/lucide"
import {IconButton} from "@qualcomm-ui/react/button"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsDatePickerContext} from "./qds-date-picker-context.js"

export interface DatePickerPrevTriggerProps extends CoreDatePickerPrevTriggerProps {
  /**
   * Icon to render. Accepts a `LucideIcon` or a `ReactElement`.
   *
   * @default ChevronLeft
   */
  icon?: LucideIconOrElement
}

/**
 * Moves the calendar to the previous page. Styled as a ghost {@link IconButton}.
 */
export function DatePickerPrevTrigger({
  icon = ChevronLeft,
  render,
  ...props
}: DatePickerPrevTriggerProps): ReactElement {
  const qdsContext = useQdsDatePickerContext()
  const mergedProps = mergeProps(qdsContext.getPrevTriggerBindings(), props)

  return (
    <CoreDatePicker.PrevTrigger
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
