// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {useDatePickerContext} from "@qualcomm-ui/react-core/date-picker"
import {Button, type ButtonProps} from "@qualcomm-ui/react/button"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface DatePickerOkTriggerProps extends ButtonProps {}

/**
 * Confirms selection and closes the calendar. Renders a {@link Button} with the
 * label "OK" by default.
 */
export function DatePickerOkTrigger({
  children,
  ...props
}: DatePickerOkTriggerProps): ReactElement {
  const {setOpen} = useDatePickerContext()
  const mergedProps = mergeProps(
    {
      onClick() {
        setOpen(false)
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
      {children ?? "OK"}
    </Button>
  )
}
