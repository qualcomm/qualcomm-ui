// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {InputErrorText, type InputErrorTextProps} from "@qualcomm-ui/react/input"
import {CorePasswordInput} from "@qualcomm-ui/react-core/password-input"
import type {IdProp} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface PasswordInputErrorTextProps
  extends InputErrorTextProps,
    IdProp {}

export function PasswordInputErrorText({
  children,
  id,
  ...props
}: PasswordInputErrorTextProps): ReactElement {
  const contextProps = CorePasswordInput.usePasswordInputErrorText({id})

  const mergedProps = mergeProps(contextProps, props)

  return <InputErrorText {...mergedProps}>{children}</InputErrorText>
}
