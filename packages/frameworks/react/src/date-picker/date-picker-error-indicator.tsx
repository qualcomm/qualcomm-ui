// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {CircleAlert} from "lucide-react"

import {
  CoreDatePicker,
  type CoreDatePickerErrorIndicatorProps,
} from "@qualcomm-ui/react-core/date-picker"
import type {LucideIconOrElement} from "@qualcomm-ui/react-core/lucide"
import {IconOrNode} from "@qualcomm-ui/react/icon"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsDatePickerContext} from "./qds-date-picker-context.js"

export interface DatePickerErrorIndicatorProps extends CoreDatePickerErrorIndicatorProps {
  /**
   * lucide-react icon or ReactNode.
   *
   * @default CircleAlert
   */
  icon?: LucideIconOrElement
}

/**
 * Visual indicator displayed inside the control when the date picker is
 * invalid. Renders a `<span>` element by default.
 */
export function DatePickerErrorIndicator({
  icon,
  render,
  ...props
}: DatePickerErrorIndicatorProps): ReactElement {
  const qdsContext = useQdsDatePickerContext()
  const mergedProps = mergeProps(qdsContext.getErrorIndicatorBindings(), props)

  return (
    <CoreDatePicker.ErrorIndicator
      {...mergedProps}
      render={<IconOrNode icon={icon || CircleAlert} render={render} />}
    />
  )
}
