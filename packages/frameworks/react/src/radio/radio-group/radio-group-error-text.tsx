// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {AlertCircle} from "lucide-react"

import {useRadioGroupErrorText} from "@qualcomm-ui/react-core/radio"
import {
  InputErrorText,
  type InputErrorTextProps,
} from "@qualcomm-ui/react/input"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsRadioContext} from "../qds-radio-context.js"

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
    qdsContext.getGroupErrorTextBindings(),
    props,
  )

  return (
    <InputErrorText icon={AlertCircle} {...mergedProps}>
      {children}
    </InputErrorText>
  )
}
