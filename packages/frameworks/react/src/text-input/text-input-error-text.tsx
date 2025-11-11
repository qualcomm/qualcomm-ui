// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  InputErrorText,
  type InputErrorTextProps,
} from "@qualcomm-ui/react/input"
import {useTextInputErrorText} from "@qualcomm-ui/react-core/text-input"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface TextInputErrorTextProps extends InputErrorTextProps {}

/**
 * Error message displayed when the input is invalid. Renders a `<div>` element by
 * default.
 */
export function TextInputErrorText({
  children,
  id,
  ...props
}: TextInputErrorTextProps): ReactElement {
  const contextProps = useTextInputErrorText({id})

  const mergedProps = mergeProps(contextProps, props)

  return <InputErrorText {...mergedProps}>{children}</InputErrorText>
}
