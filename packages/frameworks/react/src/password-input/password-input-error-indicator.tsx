// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  InputErrorIndicator,
  type InputErrorIndicatorProps,
} from "@qualcomm-ui/react/input"
import {CorePasswordInput} from "@qualcomm-ui/react-core/password-input"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface PasswordInputErrorIndicatorProps
  extends InputErrorIndicatorProps {}

export function PasswordInputErrorIndicator(
  props: PasswordInputErrorIndicatorProps,
): ReactElement {
  const contextProps = CorePasswordInput.usePasswordInputErrorIndicator()
  const mergedProps = mergeProps(contextProps, props)
  return <InputErrorIndicator {...mergedProps} />
}
