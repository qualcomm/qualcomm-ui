// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {useButtonGroupContext} from "../button-group-context"
import type {IconButtonProps} from "../icon-button.types"

import {InternalIconButton} from "./internal-icon-button"

export function ContextIconButton(baseProps: IconButtonProps): ReactElement {
  const {density, disabled, emphasis, size, variant} = useButtonGroupContext()

  return (
    <InternalIconButton
      emphasis={emphasis}
      variant={variant}
      {...baseProps}
      density={density ?? baseProps.density}
      disabled={disabled ?? baseProps.disabled}
      size={size}
    />
  )
}
