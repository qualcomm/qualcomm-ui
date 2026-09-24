// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsDatePickerContext} from "./qds-date-picker-context.js"

export interface DatePickerActionsProps extends ElementRenderProp<"div"> {}

/**
 * Footer container for the confirm/cancel actions. Intended for use when
 * `closeOnSelect` is `false`. Renders a `<div>` element by default.
 */
export function DatePickerActions(props: DatePickerActionsProps): ReactElement {
  const qdsContext = useQdsDatePickerContext()
  const mergedProps = mergeProps(qdsContext.getActionsBindings(), props)

  return <PolymorphicElement as="div" {...mergedProps} />
}
