// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  InputErrorIndicator,
  type InputErrorIndicatorProps,
} from "@qualcomm-ui/react/input"
import {useTextInputContext} from "@qualcomm-ui/react-core/text-input"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface TextInputErrorIndicatorProps
  extends InputErrorIndicatorProps {}

/**
 * Visual indicator displayed when the input is invalid. Renders a `<div>` element
 * by default.
 */
export function TextInputErrorIndicator(
  props: TextInputErrorIndicatorProps,
): ReactElement {
  const context = useTextInputContext()
  const mergedProps = mergeProps(context.getErrorIndicatorBindings(), props)
  return <InputErrorIndicator {...mergedProps} />
}
