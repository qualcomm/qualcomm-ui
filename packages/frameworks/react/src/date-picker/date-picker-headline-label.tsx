// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {useDatePickerContext} from "@qualcomm-ui/react-core/date-picker"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsDatePickerContext} from "./qds-date-picker-context.js"

export interface DatePickerHeadlineLabelProps extends ElementRenderProp<"span"> {}

/**
 * Caption above the headline value. Pass children to override. Renders a `<span>`
 * element by default.
 */
export function DatePickerHeadlineLabel({
  children,
  ...props
}: DatePickerHeadlineLabelProps): ReactElement {
  const qdsContext = useQdsDatePickerContext()
  const {selectionMode} = useDatePickerContext()
  const fallback = selectionMode === "range" ? "Date range" : "Date"
  const mergedProps = mergeProps(qdsContext.getHeadlineLabelBindings(), props)

  return (
    <PolymorphicElement as="span" {...mergedProps}>
      {children ?? fallback}
    </PolymorphicElement>
  )
}
