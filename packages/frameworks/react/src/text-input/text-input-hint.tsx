// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {InputHint, type InputHintProps} from "@qualcomm-ui/react/input"
import {useTextInputHint} from "@qualcomm-ui/react-core/text-input"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface TextInputHintProps extends InputHintProps {}

/**
 * Helper text displayed below the input. Renders a `<div>` element by default.
 */
export function TextInputHint({
  children,
  id,
  ...props
}: TextInputHintProps): ReactElement {
  const contextProps = useTextInputHint({id})
  const mergedProps = mergeProps(contextProps, props)

  return <InputHint {...mergedProps}>{children}</InputHint>
}
