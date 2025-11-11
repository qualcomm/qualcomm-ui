// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {InputErrorText, type InputErrorTextProps} from "@qualcomm-ui/react/input"
import {
  CoreCombobox,
  type CoreComboboxErrorTextProps,
} from "@qualcomm-ui/react-core/combobox"

export interface ComboboxErrorTextProps
  extends CoreComboboxErrorTextProps,
    InputErrorTextProps {}

/**
 * Error message displayed when the input is invalid. Renders a `<div>` element by
 * default.
 */
export function ComboboxErrorText({
  icon,
  render,
  ...props
}: ComboboxErrorTextProps): ReactElement {
  return (
    <CoreCombobox.ErrorText
      render={<InputErrorText icon={icon} render={render} />}
      {...props}
    />
  )
}
