// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {InputHint, type InputHintProps} from "@qualcomm-ui/react/input"
import {useSelectHint} from "@qualcomm-ui/react-core/select"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface SelectHintProps extends InputHintProps {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * Helper text displayed below the input. Renders a `<div>` element by default.
 */
export function SelectHint({
  children,
  id,
  ...props
}: SelectHintProps): ReactElement {
  const contextProps = useSelectHint({id})
  const mergedProps = mergeProps(contextProps, props)

  return <InputHint {...mergedProps}>{children}</InputHint>
}
