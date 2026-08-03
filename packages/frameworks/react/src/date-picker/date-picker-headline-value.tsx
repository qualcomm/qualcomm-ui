// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {getDatePickerHeadlineValueText} from "@qualcomm-ui/qds-core/date-picker"
import {useDatePickerContext} from "@qualcomm-ui/react-core/date-picker"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsDatePickerContext} from "./qds-date-picker-context.js"

export interface DatePickerHeadlineValueProps extends ElementRenderProp<"span"> {
  /**
   * Format used to render the selected date(s).
   */
  format?: Intl.DateTimeFormatOptions

  /**
   * Suffix appended in `multiple` mode when more than two dates are selected.
   *
   * @default (count) => `+${count} more`
   */
  moreLabel?: (count: number) => string

  /**
   * Text shown when no date is selected.
   *
   * @default 'Select date'
   */
  placeholder?: string

  /**
   * Placeholders for the start and end of an incomplete range.
   *
   * @default ['Start', 'End']
   */
  rangePlaceholder?: [string, string]
}

/**
 * Renders the current selection as human readable text. Renders a `<span>` element
 * by default.
 */
export function DatePickerHeadlineValue({
  format,
  moreLabel,
  placeholder,
  rangePlaceholder,
  ...props
}: DatePickerHeadlineValueProps): ReactElement {
  const qdsContext = useQdsDatePickerContext()
  const {format: formatDate, selectionMode, value} = useDatePickerContext()

  const text = getDatePickerHeadlineValueText({
    format: formatDate,
    formatOptions: format,
    moreLabel,
    placeholder,
    rangePlaceholder,
    selectionMode,
    value,
  })

  const mergedProps = mergeProps(qdsContext.getHeadlineValueBindings(), props)

  return (
    <PolymorphicElement as="span" {...mergedProps}>
      {text}
    </PolymorphicElement>
  )
}
