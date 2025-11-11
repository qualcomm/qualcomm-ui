// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {useButtonGroupContext} from "../button-group-context"
import type {ButtonProps} from "../button.types"

import {InternalButton} from "./internal-button"

export function ContextButton(baseProps: ButtonProps): ReactElement {
  const {density, disabled, emphasis, size, variant} = useButtonGroupContext()

  return (
    <InternalButton
      emphasis={emphasis}
      variant={variant}
      {...baseProps}
      density={density ?? baseProps.density}
      disabled={disabled ?? baseProps.disabled}
      size={size}
    />
  )
}
