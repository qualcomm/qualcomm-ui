// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ComponentPropsWithRef, ReactElement} from "react"

import type {QdsCheckboxSize} from "@qualcomm-ui/qds-core/checkbox"

import {CheckmarkCheckedIcon} from "./checkmark-checked-icon"
import {CheckmarkIndeterminateIcon} from "./checkmark-indeterminate-icon"

export interface CheckboxIndicatorIconProps
  extends ComponentPropsWithRef<"svg"> {
  indeterminate: boolean | undefined
  size?: QdsCheckboxSize
}

export function CheckmarkIcon({
  indeterminate,
  ...props
}: CheckboxIndicatorIconProps): ReactElement {
  return indeterminate ? (
    <CheckmarkIndeterminateIcon {...props} />
  ) : (
    <CheckmarkCheckedIcon {...props} />
  )
}
