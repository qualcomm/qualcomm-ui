// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {InputLabel} from "@qualcomm-ui/react/input"
import type {ElementRenderProp} from "@qualcomm-ui/react-core/system"
import {
  useTextInputContext,
  useTextInputLabel,
} from "@qualcomm-ui/react-core/text-input"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface TextInputLabelProps extends ElementRenderProp<"label"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * An accessible label that is automatically associated with the input. Renders a
 * `<label>` element by default.
 */
export function TextInputLabel({
  id,
  ...props
}: TextInputLabelProps): ReactElement {
  const contextProps = useTextInputLabel({id})
  const textInputContext = useTextInputContext()

  const mergedProps = mergeProps(contextProps, props)

  return <InputLabel required={textInputContext.required} {...mergedProps} />
}
