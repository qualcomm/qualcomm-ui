// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {InputLabel, type InputLabelProps} from "@qualcomm-ui/react/input"
import {
  CorePasswordInput,
  usePasswordInputContext,
} from "@qualcomm-ui/react-core/password-input"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface PasswordInputLabelProps extends InputLabelProps {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function PasswordInputLabel(
  props: PasswordInputLabelProps,
): ReactElement {
  const context = usePasswordInputContext()
  const contextProps = CorePasswordInput.usePasswordInputLabel({id: props.id})

  const mergedProps = mergeProps(contextProps, props)

  return <InputLabel required={context.required} {...mergedProps} />
}
