// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  InputErrorIndicator,
  type InputErrorIndicatorProps,
} from "@qualcomm-ui/react/input"
import {
  CoreCombobox,
  type CoreComboboxErrorIndicatorProps,
} from "@qualcomm-ui/react-core/combobox"

export interface ComboboxErrorIndicatorProps
  extends CoreComboboxErrorIndicatorProps,
    InputErrorIndicatorProps {}

/**
 * Visual indicator displayed when the input is invalid. Renders a `<div>` element
 * by default.
 */
export function ComboboxErrorIndicator({
  icon,
  render,
  ...props
}: ComboboxErrorIndicatorProps): ReactElement {
  return (
    <CoreCombobox.ErrorIndicator
      render={<InputErrorIndicator icon={icon} render={render} />}
      {...props}
    />
  )
}
