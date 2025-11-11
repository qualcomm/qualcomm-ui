// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {
  InputErrorText,
  type InputErrorTextProps,
} from "@qualcomm-ui/react/input"
import {useRadioGroupErrorText} from "@qualcomm-ui/react-core/radio"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsRadioContext} from "../qds-radio-context"

export interface RadioGroupErrorTextProps extends InputErrorTextProps {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function RadioGroupErrorText({
  children,
  id,
  ...props
}: RadioGroupErrorTextProps): ReactElement {
  const contextProps = useRadioGroupErrorText({id})
  const qdsContext = useQdsRadioContext()
  const mergedProps = mergeProps(
    contextProps,
    qdsContext.getErrorTextBindings(),
    props,
  )

  return <InputErrorText {...mergedProps}>{children}</InputErrorText>
}
