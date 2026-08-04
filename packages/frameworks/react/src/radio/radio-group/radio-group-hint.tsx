// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {useRadioGroupHint} from "@qualcomm-ui/react-core/radio"
import {InputHint, type InputHintProps} from "@qualcomm-ui/react/input"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsRadioContext} from "../qds-radio-context.js"

export interface RadioGroupHintProps extends InputHintProps {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function RadioGroupHint({
  children,
  id,
  ...props
}: RadioGroupHintProps): ReactElement {
  const contextProps = useRadioGroupHint({id})
  const qdsContext = useQdsRadioContext()
  const mergedProps = mergeProps(
    contextProps,
    qdsContext.getGroupHintBindings(),
    props,
  )

  return <InputHint {...mergedProps}>{children}</InputHint>
}
