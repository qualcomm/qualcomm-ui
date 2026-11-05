// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsDatePickerContext} from "./qds-date-picker-context.js"

export interface DatePickerHeadlineProps extends ElementRenderProp<"div"> {}

/**
 * Container for the calendar headline. Renders a `<div>` element by default.
 */
export function DatePickerHeadline(
  props: DatePickerHeadlineProps,
): ReactElement {
  const qdsContext = useQdsDatePickerContext()
  const mergedProps = mergeProps(qdsContext.getHeadlineBindings(), props)

  return <PolymorphicElement as="div" {...mergedProps} />
}
