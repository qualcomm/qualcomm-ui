// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {useDatePickerContext} from "@qualcomm-ui/react-core/date-picker"
import {Button, type ButtonProps} from "@qualcomm-ui/react/button"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface DatePickerCancelTriggerProps extends ButtonProps {}

/**
 * Discards selection, restores previous value, and closes the calendar. Renders a
 * {@link Button} with the label "Cancel" by default.
 */
export function DatePickerCancelTrigger({
  children,
  ...props
}: DatePickerCancelTriggerProps): ReactElement {
  const api = useDatePickerContext()
  const mergedProps = mergeProps(
    {
      onClick() {
        api.cancel()
      },
      type: "button" as const,
    },
    props,
  )

  return (
    <Button
      density="compact"
      emphasis="primary"
      variant="ghost"
      {...mergedProps}
    >
      {children ?? "Cancel"}
    </Button>
  )
}
