// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {InputHint, type InputHintProps} from "@qualcomm-ui/react/input"
import {CoreCombobox} from "@qualcomm-ui/react-core/combobox"

export interface ComboboxHintProps extends InputHintProps {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * Helper text displayed below the input. Renders a `<div>` element by default.
 */
export function ComboboxHint({
  children,
  render,
  ...props
}: ComboboxHintProps): ReactElement {
  return (
    <CoreCombobox.Hint render={<InputHint render={render} />} {...props}>
      {children}
    </CoreCombobox.Hint>
  )
}
